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
document.getElementById('ownershipForm').addEventListener('submit', async function (event) {
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
    const abi = [{"inputs":[{"internalType":"bytes32","name":"signupId","type":"bytes32"},{"internalType":"string","name":"creator_name","type":"string"},{"internalType":"string","name":"creator_addr","type":"string"},{"internalType":"string","name":"user_name","type":"string"},{"internalType":"string","name":"user_addr","type":"string"}],"name":"owner","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"name":"release","outputs":[{"internalType":"string","name":"creator_name","type":"string"},{"internalType":"string","name":"creator_addr","type":"string"},{"internalType":"string","name":"user_name","type":"string"},{"internalType":"string","name":"user_addr","type":"string"}],"stateMutability":"view","type":"function"}];
    const contractAddress = '0xd9145CCE52D386f254917e481eB44e9943F39138';
    const contract = new web3.eth.Contract(abi, contractAddress);

    const creator_name = document.getElementById('creatorName').value;
    const creator_addr = document.getElementById('creatorAddr').value;
    const user_name = document.getElementById('userName').value;
    const user_addr = document.getElementById('userAddr').value;

    try {
        const signupId = web3.utils.keccak256(web3.utils.randomHex(32));

        const result = await contract.methods.owner(signupId, creator_name,creator_addr,user_name,user_addr)
            .send({ from: accounts[0] });

        console.log('Transaction successful! Transaction hash:', result.transactionHash);

        const coaDetails = await contract.methods.signup(signupId).call();
        console.log('User Details:', coaDetails);
    } catch (error) {
        console.error('Error signing up creator:', error);
    }
});
