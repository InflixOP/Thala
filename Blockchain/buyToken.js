const Web3 = window.Web3;
const web3 = new Web3(window.ethereum);
if (window.ethereum) {
    if (window.ethereum.isMetaMask) {
        window.ethereum
            .request({ method: 'eth_requestAccounts' })
            .then(async accounts => {
                const account = accounts[0];

                const buyButton = document.getElementById('buyButton');
                buyButton.addEventListener('click', async () => {
                    const totalAmount = '0.3'; 
                    const recipient1 = document.getElementById('recipient1').value;
                    const recipient2 = document.getElementById('recipient2').value;
                    const recipient3 = document.getElementById('recipient3').value;

                    if (!totalAmount || !recipient1 || !recipient2 || !recipient3) {
                        alert("Please enter all recipients' addresses and the total amount.");
                        return;
                    }

                    try {
                        const balance = await web3.eth.getBalance(account);
                        if (Number(balance) < Number(totalAmount)) {
                            alert("Insufficient funds in the account.");
                            return;
                        }

                        const amountInWei = web3.utils.toWei(totalAmount, 'ether');
                        const amountPerRecipient = web3.utils.toBN(amountInWei).div(web3.utils.toBN(3));

                        const batch = new web3.BatchRequest();

                        const transactionObject1 = {
                            from: account,
                            to: recipient1,
                            value: amountPerRecipient.toString(),
                            gas: '21000',
                            gasPrice: '5000000000',
                            chainId: 80001
                        };
                        const transactionObject2 = {
                            from: account,
                            to: recipient2,
                            value: amountPerRecipient.toString(),
                            gas: '21000',
                            gasPrice: '5000000000',
                            chainId: 80001
                        };
                        const transactionObject3 = {
                            from: account,
                            to: recipient3,
                            value: amountPerRecipient.toString(),
                            gas: '21000',
                            gasPrice: '5000000000',
                            chainId: 80001
                        };

                        batch.add(web3.eth.sendTransaction.request(transactionObject1, () => {}));
                        batch.add(web3.eth.sendTransaction.request(transactionObject2, () => {}));
                        batch.add(web3.eth.sendTransaction.request(transactionObject3, () => {}));

                        batch.execute();
                    } catch (error) {
                        console.error('Error sending MATIC:', error);
                        alert(`Error sending MATIC: ${error.message}`);
                    }
                });
            })
            .catch(error => {
                console.error('Error connecting to MetaMask:', error);
                alert(`Error connecting to MetaMask: ${error.message}`);
            });
    } else {
        console.error('Please install MetaMask.');
        alert('Please install MetaMask.');
    }
} else {
    console.error('Please install MetaMask.');
    alert('Please install MetaMask.');
}
