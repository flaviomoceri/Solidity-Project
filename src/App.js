import './App.css';
import { useState } from 'react';
import { Input } from 'antd';
import { Card } from 'antd';
import { Row, Col } from 'antd';
import { Button } from 'antd';
import { ethers } from 'ethers'
import Greeter from './artifacts/contracts/Greeter.sol/Greeter.json'
import Token from './artifacts/contracts/Token.sol/Token.json'

// Update with the contract address logged out to the CLI when it was deployed 
const greeterAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
const tokenAddress = "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707"

function App() {
  // store greeting in local state
  const [greeting, setGreetingValue] = useState('');
  const [userAccount, setUserAccount] = useState('');
  const [amount, setAmount] = useState(0);

  // request access to the user's MetaMask account
  async function requestAccount() {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  }


  async function getBalance() {
    if (typeof window.ethereum !== 'undefined') {
      const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' })
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(tokenAddress, Token.abi, provider)
      const balance = await contract.balanceOf(account);
      console.log("Balance: ", balance.toString());
    }
  }



  async function sendCoins() {
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(tokenAddress, Token.abi, signer);
      const transation = await contract.transfer(userAccount, amount);
      await transation.wait();
      console.log(`${amount} Coins successfully sent to ${userAccount}`);
    }
  }






  // call the smart contract, read the current greeting value
  async function fetchGreeting() {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, provider)
      try {
        const data = await contract.greet()
        console.log('data: ', data)
      } catch (err) {
        console.log("Error: ", err)
      }
    }    
  }

  // call the smart contract, send an update
  async function setGreeting() {
    if (!greeting) return
    if (typeof window.ethereum !== 'undefined') {
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner()
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer)
      const transaction = await contract.setGreeting(greeting)
      setGreetingValue('')
      await transaction.wait()
      fetchGreeting()
    }
  }

  return (
    <div className="App">
      <header>
      </header>
      <div className="App-header">
        <Card
    hoverable
   className="card-app"
  >
    <Input className="input1" onChange={e => setGreetingValue(e.target.value)} placeholder="Set greeting" value={greeting} />
    <div className="div1">
   <Button className="button1" type="primary" shape="round" onClick={fetchGreeting}><h5 className="text1">Fetch Greeting</h5></Button>
        <Button className="button1" type="primary" shape="round" onClick={setGreeting}><h5 className="text1">Set Greeting</h5></Button>
        </div>
  </Card>
        
     

        <br />
        <Card
    hoverable
   className="card-app"
  >
    <Input className="input2" onChange={e => setAmount(e.target.value)} placeholder="Amount" />
    <Input className="input3" onChange={e => setUserAccount(e.target.value)} placeholder="Account ID" />
    <div className="div2">
   <Button className="button1" type="primary" shape="round" onClick={getBalance}><h5 className="text1">Get Balance</h5></Button>
        <Button className="button1" type="primary" shape="round" onClick={sendCoins}><h5 className="text1">Send Coins</h5></Button>
        </div>
  </Card>
        </div>
      <footer></footer>
    </div>
  );
}

export default App;