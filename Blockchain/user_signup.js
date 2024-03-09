const Web3 = window.Web3;
let web3;
const initWeb3 = async () => {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
    } else if (window.web3) {
        web3 = new Web3(window.web3.currentProvider);
    } else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
        return null;
    }
    return web3;
};
document.getElementById('signupForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    await initWeb3();

    if (!web3) {
        console.error('Web3 is not initialized.');
        return;
    }
    const accounts = await web3.eth.getAccounts();

    if (accounts.length === 0) {
        console.error('MetaMask is not connected.');
        return;
    }
    const abi = [{"inputs":[{"internalType":"bytes32","name":"signupId","type":"bytes32"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"email","type":"string"},{"internalType":"uint256","name":"phone","type":"uint256"},{"internalType":"uint256","name":"age","type":"uint256"},{"internalType":"string","name":"addr","type":"string"}],"name":"addUser","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"signup","outputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"email","type":"string"},{"internalType":"uint256","name":"phone","type":"uint256"},{"internalType":"uint256","name":"age","type":"uint256"},{"internalType":"string","name":"addr","type":"string"}],"stateMutability":"view","type":"function"}];
    const contractAddress = '0xD7ACd2a9FD159E69Bb102A1ca21C9a3e3A5F771B';
    const contract = new web3.eth.Contract(abi, contractAddress);

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = parseInt(document.getElementById('phone').value);
    const age = parseInt(document.getElementById('age').value);
    const addr = document.getElementById('addr').value;

    try {
        const signupId = web3.utils.keccak256(web3.utils.randomHex(32));

        const result = await contract.methods.addUser(signupId, name, email,phone,age, addr)
            .send({ from: accounts[0] });

        console.log('Transaction successful! Transaction hash:', result.transactionHash);

        const userDetails = await contract.methods.signup(signupId).call();
        console.log('User Details:', userDetails);
    } catch (error) {
        console.error('Error signing up user:', error);
    }
});
