import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Login from './Components/Login';
import Finished from './Components/Finished';
import Connected from './Components/Connected';
import MainScreen from './Components/MainScreen';
import axios from "axios";
import './App.css';
import LoadingSpinner from './Components/LoadingSpinner';

// const URL = 'https://voting-server-tgin.onrender.com'
const URL = 'http://localhost:5000'

function App() {
  const [showMainScreen, setShowMainScreen] = useState(true);
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);

  const [contractAddress, setContractAddress] = useState(null);
  const [contractAbi, setContractAbi] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [votingStatus, setVotingStatus] = useState(true);
  const [remainingTime, setRemainingTime] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [canVote, setCanVote] = useState(false);
  const [userId, setUserId] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [verificationError, setVerificationError] = useState('');
  const [votingResults, setVotingResults] = useState([]);
  const [loadingIndex, setLoadingIndex] = useState(null); // Track the loading state for the clicked button

  const [hasServer, setHasServer] = useState(false)

  const [adminLoginError, setAdminLoginError] = useState('')
  const [isConnectedAdmin, setIsConnectedAdmin] = useState(false)
  const [canConnectAdmin,setCanConnectAdmin] = useState(false)

  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')

  const [isDeploymentLoading,setIsDeploymentLoading] = useState(false)

  const [loginButtonMsg,setLoginButtonMsg] = useState('')

  const fetchContractAbi = async () => {
    try {
      const res = await axios.get(`${URL}/contract_abi`);
      setContractAbi(res.data);
      console.log(res.data) ////////////////////////////////////////////////////////////////////////////
      setHasServer(true)
    } catch (err) {
      if (err['message'] === 'Network Error') {
        setHasServer(false)
        setVotingStatus(false)
      }
      console.log(err);
    }
  };

  const fetchContractAddress = async () => {
    try {
      const res = await axios.get(`${URL}/contract_address`);
      setContractAddress(res.data);
      console.log(res.data) /////////////////////////////////////////////////////////////////////////////
      setHasServer(true)
      res.data === "0x" ? setVotingStatus(false) : setVotingStatus(true)

    } catch (err) {
      if (err['message'] === 'Network Error') {
        setHasServer(false)
        setVotingStatus(false)
      }
      console.log(err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchContractAddress();
      await fetchContractAbi();
    };
    fetchData();
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    }
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      if (contractAddress && contractAbi.length > 0 && votingStatus) {
        await getRemainingTime();
        await getCurrentStatus();
      }
    };
    fetchData();
  }, [contractAddress, contractAbi]);
  useEffect(() => {
    if (account && isVerified) {
      const fetchResults = async () => {
        await checkVotingStatus();
        await getCandidateNames();
      };
      fetchResults();
    }
  }, [account, isVerified]);


  function logInAdmin() {
    if (!hasServer) {
      setAdminLoginError('Please connect to the server first before starting the ballot.')
      return;
    }
    if (votingStatus) {
      setAdminLoginError('There is a ballot already. please wait for the ballot to finish or stop the server.')
      return;
    }
    setCanConnectAdmin(!canConnectAdmin)
  }
  async function startBallot(event){
    // check voting admin user name and password.
    let response;
    event.preventDefault(); // Prevent page refresh
    try {
      response = await axios.post(`${URL}/admin_auth`, {
          "userName": userName,
          "password": password
      });
      if(response){
        setIsConnectedAdmin(response.data);
        console.log('is connected: ', response)
      }
    } catch (error) {
      console.error('There was an error!', error);
    }
    if(!response.data){
      alert('user name or password are not correct.')
      setUserName('')
      setPassword('')
      return;
    }
    setIsDeploymentLoading(true)
    try{
      response = await axios.post(`${URL}/start_ballot`, {
        "userName": userName,
        "password": password
      })
      if(!response){
        alert('The ballot did not starte successfully. Please try again.')
        window.location.reload();  
      }
      alert('The ballot started successfully.')
      window.location.reload();

    }catch(error){
      console.error('There was an error!', error);
    }
    finally {
      setIsDeploymentLoading(false)
    }
  }

  async function connectToMetamask() {
    if (window.ethereum) {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(provider);
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        const checksummedAddress = ethers.utils.getAddress(address);
        setAccount(checksummedAddress);
        setIsConnected(true);

        checkVotingStatus();
      } catch (err) {
        alert('Please connect to Metamask Manually');
        console.log(err);
      }
    } else {
      console.log("Metamask is not detected in the browser");
    }
  }

  async function verifyVoter() {
    if (!userId.trim()) {
      setVerificationError("Please enter your ID");
      return;
    }
    try {
      const response = await fetch(`${URL}/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, metamaskAddress: account }),
      });
      const data = await response.json();
      if (data.verified) {
        setUserId('');
        setIsVerified(true);
        setVerificationError('');
        await checkVotingStatus();
      } else {
        setVerificationError("Verification failed. Please check your ID.");
      }
    } catch (error) {
      console.log("Error during verification:", error);
      setVerificationError("An error occurred during verification.");
    }
  }
  async function vote(index) {
    if (!isVerified) {
      setVerificationError("Please verify your ID before voting.");
      return;
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const contractInstance = new ethers.Contract(
      contractAddress, contractAbi, signer
    );

    try {
      const tx = await contractInstance.vote(index);
      await tx.wait();
      await checkVotingStatus();
      await getCandidateNames();
    } catch (error) {
      const error_msg = error['data']['message']
      if(error_msg.includes('You have not received the token yet.')){
        alert(`You still haven't received VTK, please wait.`)
        return;
      }
      console.log("Error during voting:", error);
    }
  }

  async function checkVotingStatus() {
    if (!account || !contractAddress || contractAbi.length === 0) {
      console.log("Required data not available to check voting status");
      return;
    }
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      // const signer = provider.getSigner();
      const contractInstance = new ethers.Contract(contractAddress, contractAbi, provider);
      const hasUserVoted = await contractInstance.hasVoted(account);
      setCanVote(!hasUserVoted); // Set to true if the user hasn't voted yet
    } catch (error) {
      console.log("Error checking voting status:", error);
      setCanVote(false);
    }
  }
  async function loadVotingReuslts(_) {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contractInstance = new ethers.Contract(contractAddress, contractAbi, signer);
      const tx = await contractInstance.setVoteResults();
      await tx.wait()
      let candidatesList = await contractInstance.getVotingResults();
      candidatesList = candidatesList.map((candidate_result) => Number(candidate_result['_hex']));

      console.log(candidatesList);
      setVotingResults(candidatesList)

    } catch (err) {
      console.log('Error initializing contract or fetching candidates:', err)
      throw err
    }
  }

  async function getCandidateNames() {
    if (!contractAddress || contractAbi.length === 0) {
      console.log("Contract address or ABI missing");
      return;
    }
    try {
      const response = await axios.get(`${URL}/candidates`);
      const names = response.data.map((obj) => Object.keys(obj)[0]);

      setCandidates(names);
    } catch (error) {
      console.log('Error initializing contract or fetching candidates:', error);
    }
  }

  async function getCurrentStatus() {
    if (!contractAddress || contractAbi.length === 0) {
      console.log("Contract address or ABI missing");
      return;
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contractInstance = new ethers.Contract(contractAddress, contractAbi, provider);
    const isBallotActive = await contractInstance.getVotingStatus();
    setVotingStatus(isBallotActive);
  }
  async function getRemainingTime() {
    if (!contractAddress || contractAbi.length === 0) {
      console.log("Contract address or ABI missing");
      return;
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contractInstance = new ethers.Contract(contractAddress, contractAbi, provider);
    const time = await contractInstance.getRemainingTime();
    setRemainingTime(parseInt(time['_hex'], 16));
  }
  function handleAccountsChanged(accounts) {
    setVotingResults([])
    setIsVerified(false)
    setLoadingIndex(null)
    if (accounts.length > 0 && account !== accounts[0]) {
      const checksummedAddress = ethers.utils.getAddress(accounts[0]);
      setAccount(checksummedAddress);
      setIsConnected(true)
      checkVotingStatus();
    } else {
      setIsConnected(false);
      setAccount(null);
    }
  }
  const proceedToLogin = () => {
    setShowMainScreen(false);
  };
  return (
    <div className="App">
      {!hasServer ? (<>
        No connection to the server.
      </>) : isDeploymentLoading ? (<LoadingSpinner/>) : (
        showMainScreen ? (
          <MainScreen onProceed={proceedToLogin} />
        ) : votingStatus ? (
          isConnected ? (
            <Connected
              loadingIndex={loadingIndex}
              setLoadingIndex={setLoadingIndex}
              account={account}
              candidateNames={candidates}
              getCands={getCandidateNames}
              remainingTime={remainingTime}
              loadVotingReuslts={loadVotingReuslts}
              votingResults={votingResults}
              voteFunction={vote}
              canVote={canVote}
              userId={userId}
              setUserId={setUserId}
              verifyVoter={verifyVoter}
              isVerified={isVerified}
              verificationError={verificationError}
            />
          ) : (
            <Login
            connectWallet={connectToMetamask}
            contractAddress = {contractAddress}
            logInAdmin={logInAdmin}
            adminLoginError={adminLoginError}
            isConnectedAdmin={isConnectedAdmin}
            votingStatus = {votingStatus}
            canConnectAdmin = {canConnectAdmin}
            setUserName = {setUserName}
            userName = {userName}
            setPassword = {setPassword}
            password = {password}
            startBallot = {startBallot}
            isDeploymentLoading = {isDeploymentLoading}
            />
          )
        ) : isConnected ? (
          <Finished
            loadingIndex={loadingIndex}
            setLoadingIndex={setLoadingIndex}
            loadVotingReuslts={loadVotingReuslts}
            candidateNames={candidates}
            getCands={getCandidateNames}
            votingResults={votingResults}
          />
        ) : (<Login
          connectWallet={connectToMetamask}
          contractAddress = {contractAddress}
          logInAdmin={logInAdmin}
          adminLoginError={adminLoginError}
          isConnectedAdmin={isConnectedAdmin}
          votingStatus = {votingStatus}
          canConnectAdmin = {canConnectAdmin}
          setUserName = {setUserName}
          userName = {userName}
          setPassword = {setPassword}
          password = {password}
          startBallot = {startBallot}
          isDeploymentLoading = {isDeploymentLoading}
        />)
      )}
    </div>
  );
}
export default App;