const contractABI = [
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "signupId",
                "type": "bytes32"
            },
            {
                "internalType": "string",
                "name": "creator_name",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "creator_addr",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "number",
                "type": "uint256"
            }
        ],
        "name": "relToken",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "name": "release",
        "outputs": [
            {
                "internalType": "string",
                "name": "creator_name",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "creator_addr",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "number",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];
const contractAddress = '0xd8b934580fcE35a11B58C6D73aDeE468a2833fa8'; 
let web3;

async function initWeb3() {
    if (window.ethereum) {
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            web3 = new Web3(window.ethereum);
            console.log('Web3 initialized');
        } catch (error) {
            console.error('User denied account access:', error);
        }
    } else if (window.web3) {
        web3 = new Web3(window.web3.currentProvider);
        console.log('Web3 initialized');
    } else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
}

async function deployContractAndSendTransaction() {
    if (!web3) {
        console.error("Web3 is not found. Make sure you are using a web3-enabled browser like MetaMask.");
        return;
    }
    try {
        const accounts = await web3.eth.getAccounts();
        const account = accounts[0];
        const contract = new web3.eth.Contract(contractABI, contractAddress);
        const signupId = web3.utils.utf8ToHex(document.getElementById('signupId').value);
        const creator_name = document.getElementById('creator_name').value;
        const creator_addr = document.getElementById('creator_addr').value;
        const number = document.getElementById('number').value;
        const totalAmount = '0.03'; 
        const recipient1 = document.getElementById('recipient1').value;
        
        const balance = await web3.eth.getBalance(account);
        if (Number(balance) < Number(totalAmount)) {
            alert("Insufficient funds in the account.");
            return;
        }
        
        const amountInWei = web3.utils.toWei(totalAmount, 'ether');
        
        const transactionObject1 = {
            from: account,
            to: contractAddress,
            data: contract.methods.relToken(signupId, creator_name, creator_addr, number).encodeABI(),
            gas: '2000000', 
            chainId: 80001
        };
        
        const transactionObject2 = {
            from: account,
            to: recipient1,
            value: amountInWei.toString(),
            gas: '21000',
            gasPrice: '5000000000',
            chainId: 80001
        };
        
        const batch = new web3.BatchRequest();
        
        batch.add(web3.eth.sendTransaction.request(transactionObject1, (err, txHash) => {
            if (err) {
                console.error('Error deploying contract:', err);
                alert(`Error deploying contract: ${err.message}`);
            } else {
                console.log('Transaction hash for contract deployment:', txHash);
            }
        }));
        
        batch.add(web3.eth.sendTransaction.request(transactionObject2, (err, txHash) => {
            if (err) {
                console.error('Error sending MATIC:', err);
                alert(`Error sending MATIC: ${err.message}`);
            } else {
                console.log('Transaction hash for sending MATIC:', txHash);
            }
        }));
        
        batch.execute();
        
    } catch (error) {
        console.error('Error:', error);
        alert(`Error: ${error.message}`);
    }
}

document.getElementById('deployButton').addEventListener('click', deployContractAndSendTransaction);
initWeb3();
