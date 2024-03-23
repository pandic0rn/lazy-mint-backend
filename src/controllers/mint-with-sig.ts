import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import { nftCollectionAddress, chain } from "../data/address";
import { NFT } from "../models/NFT";
import { Request, Response } from "express";
import { nfts } from "../data/nfts";

//TODO check async need and meaning
export const mintWithSignature = async (req: Request, res: Response) => {
	//   const jsonData = {
	//     to: "0xcE19De22143CD60741306a2067aEec48135fB901",
	//     royaltyRecipient: "0x16d4D960b9aA4D2278992b9D4FC13A25FDabCd6e",
	//     royaltyBps: 100,
	//     primarySaleRecipient: "0x16d4D960b9aA4D2278992b9D4FC13A25FDabCd6e",
	//     tokenId: 5,
	//     uri: "uri",
	//     quantity: 1,
	//     pricePerToken: 10000,
	//     currency: "0x5C676A4AE6828Df7C1Fb140D5b99B0e4f3aB2471",
	//     validityStartTimestamp: 1672320000,
	//     validityEndTimestamp: 1672406400,
	//     uid: "0x0000000000000000000000000000000000000000000000000000000000000005",
	//   };
	const jsonData = req.body;
    console.log('Received JSON data:', jsonData);
	const { tokenId: id, to: address } = jsonData;
	//const { id, address } = JSON.parse(req.body);

	try {
		const sdk = ThirdwebSDK.fromPrivateKey(
			process.env.WALLET_PRIVATE_KEY!,
			chain,
			{
				secretKey: process.env.TW_SECRET_KEY,
			}
		);

		const nftCollection = await sdk.getContract(
			nftCollectionAddress,
			"nft-collection"
		);

		const mintedNfts = await nftCollection?.erc721.getAll();

		if (mintedNfts) {
			const mintedNft = mintedNfts.find(
				// @ts-ignore
			    (nft) => nft.metadata.attributes[0].id === id
			);

			if (mintedNft) {
				return res.status(400).json({ error: "NFT already minted" });
			}
		}

		const { name, description, url, price } = nfts[id];

		const metadata = {
			metadata: {
				name,
				description,
				image: url,
				attributes: [{ id }],
			},
			price,
			to: address,
		};

		const signature = await nftCollection?.signature.generate(metadata);
		console.log(metadata);
		console.log(signature);

		const minted = await nftCollection?.signature.mint(signature);

		return res.status(200).json({ minted });
	} catch (error) {
		return res.status(500).json({ error });
	}
};

//TODO check if export like that is required
export default mintWithSignature;

/*
Sample response to 		const signature = await nftCollection?.signature.generate(metadata);

{
  "signature": {
    "payload": {
      "to": "0xcE19De22143CD60741306a2067aEec48135fB901",
      "price": "0.02",
      "currencyAddress": "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
      "mintStartTime": {
        "type": "BigNumber",
        "hex": "0x00"
      },
      "mintEndTime": {
        "type": "BigNumber",
        "hex": "0x78cb50b4"
      },
      "uid": "0x3062366636373537653836353434383261306536386563343964326336376638",
      "primarySaleRecipient": "0x0000000000000000000000000000000000000000",
      "metadata": {
        "name": "NFT 5",
        "description": "This is our fifth amazing NFT",
        "image": "https://bafybeieufjiaqny6q6kis2ehv2w6epwqzkeoscfc3ltck67dunrbvseczq.ipfs.nftstorage.link/",
        "attributes": [
          {
            "id": 4
          }
        ]
      },
      "royaltyRecipient": "0x0000000000000000000000000000000000000000",
      "royaltyBps": {
        "type": "BigNumber",
        "hex": "0x00"
      },
      "uri": "ipfs://QmXiC1EpNDcE29RxpKUkPkjnWWdvxk5pPAbj2evJ9j61WU/0",
      "quantity": {
        "type": "BigNumber",
        "hex": "0x01"
      }
    },
    "signature": "0x321d2a50e9c18d810ee65b55dc4c04c0104d48098da59756f431cdd9ab4586d167eebbf6ad8ed7d3ce148744cd393625ee6eb2d327c54540136a037513dfee441c"
  }
}
*/

/**
 * Sample mint response to const minted = await nftCollection?.signature.mint(signature);
 * {
  "minted": {
    "id": {
      "type": "BigNumber",
      "hex": "0x05"
    },
    "receipt": {
      "to": "0xB5A73A7Eb92F478661548dc4aF83a3924CeB6e83",
      "from": "0xcE19De22143CD60741306a2067aEec48135fB901",
      "contractAddress": null,
      "transactionIndex": 0,
      "gasUsed": {
        "type": "BigNumber",
        "hex": "0x0494a2"
      },
      "logsBloom": "0x0000000000000000010000000000000000000000000000000000000000000000200000400000000000000010000000000000800000200000010000000000000000001000000000000000000800000180000000000004000004010000000000000000000002000000000000000000080000000000000000008000001020010000000000000000000000002000000000100000080000000000000200000000000020000000000000000000000040000000220000000020400000004000000000c000000002000000000001000000000000000000000000800000108000000020000000000000000000200002000000000002000000000000000200000000100800",
      "blockHash": "0x50b1c7de0926e83341e0ff8f1b1008231281026f8b91d805adf57ccc874965d2",
      "transactionHash": "0xced5ecfcb571469b0f39c0e698011163101d1a84e6d919d706f7395e8f4ddeda",
      "logs": [
        {
          "transactionIndex": 0,
          "blockNumber": 47401359,
          "transactionHash": "0xced5ecfcb571469b0f39c0e698011163101d1a84e6d919d706f7395e8f4ddeda",
          "address": "0x0000000000000000000000000000000000001010",
          "topics": [
            "0xe6497e3ee548a3372136af2fcb0696db31fc6cf20260707645068bd3fe97f3c4",
            "0x0000000000000000000000000000000000000000000000000000000000001010",
            "0x000000000000000000000000ce19de22143cd60741306a2067aeec48135fb901",
            "0x000000000000000000000000b5a73a7eb92f478661548dc4af83a3924ceb6e83"
          ],
          "data": "0x00000000000000000000000000000000000000000000000000071afd498d000000000000000000000000000000000000000000000000000003c3c599b5870843000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003bcaa9c6bfa084300000000000000000000000000000000000000000000000000071afd498d0000",
          "logIndex": 0,
          "blockHash": "0x50b1c7de0926e83341e0ff8f1b1008231281026f8b91d805adf57ccc874965d2"
        },
        {
          "transactionIndex": 0,
          "blockNumber": 47401359,
          "transactionHash": "0xced5ecfcb571469b0f39c0e698011163101d1a84e6d919d706f7395e8f4ddeda",
          "address": "0xB5A73A7Eb92F478661548dc4aF83a3924CeB6e83",
          "topics": [
            "0xf8e1a15aba9398e019f0b49df1a4fde98ee17ae345cb5f6b5e2c27f5033e8ce7"
          ],
          "data": "0x0000000000000000000000000000000000000000000000000000000000000005",
          "logIndex": 1,
          "blockHash": "0x50b1c7de0926e83341e0ff8f1b1008231281026f8b91d805adf57ccc874965d2"
        },
        {
          "transactionIndex": 0,
          "blockNumber": 47401359,
          "transactionHash": "0xced5ecfcb571469b0f39c0e698011163101d1a84e6d919d706f7395e8f4ddeda",
          "address": "0xB5A73A7Eb92F478661548dc4aF83a3924CeB6e83",
          "topics": [
            "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
            "0x0000000000000000000000000000000000000000000000000000000000000000",
            "0x000000000000000000000000ce19de22143cd60741306a2067aeec48135fb901",
            "0x0000000000000000000000000000000000000000000000000000000000000005"
          ],
          "data": "0x",
          "logIndex": 2,
          "blockHash": "0x50b1c7de0926e83341e0ff8f1b1008231281026f8b91d805adf57ccc874965d2"
        },
        {
          "transactionIndex": 0,
          "blockNumber": 47401359,
          "transactionHash": "0xced5ecfcb571469b0f39c0e698011163101d1a84e6d919d706f7395e8f4ddeda",
          "address": "0xB5A73A7Eb92F478661548dc4aF83a3924CeB6e83",
          "topics": [
            "0x9d89e36eadf856db0ad9ffb5a569e07f95634dddd9501141ecf04820484ad0dc",
            "0x000000000000000000000000ce19de22143cd60741306a2067aeec48135fb901",
            "0x0000000000000000000000000000000000000000000000000000000000000005"
          ],
          "data": "0x00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000037697066733a2f2f516d5470345741417956676f636e4578313847717a76377a4d6a386d514e76736673346f556373624763325969362f30000000000000000000",
          "logIndex": 3,
          "blockHash": "0x50b1c7de0926e83341e0ff8f1b1008231281026f8b91d805adf57ccc874965d2"
        },
        {
          "transactionIndex": 0,
          "blockNumber": 47401359,
          "transactionHash": "0xced5ecfcb571469b0f39c0e698011163101d1a84e6d919d706f7395e8f4ddeda",
          "address": "0x0000000000000000000000000000000000001010",
          "topics": [
            "0xe6497e3ee548a3372136af2fcb0696db31fc6cf20260707645068bd3fe97f3c4",
            "0x0000000000000000000000000000000000000000000000000000000000001010",
            "0x000000000000000000000000b5a73a7eb92f478661548dc4af83a3924ceb6e83",
            "0x00000000000000000000000016d4d960b9aa4d2278992b9d4fc13a25fdabcd6e"
          ],
          "data": "0x00000000000000000000000000000000000000000000000000071afd498d000000000000000000000000000000000000000000000000000000071afd498d0000000000000000000000000000000000000000000000000000068039a0a9ff453d00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000687549df38c453d",
          "logIndex": 4,
          "blockHash": "0x50b1c7de0926e83341e0ff8f1b1008231281026f8b91d805adf57ccc874965d2"
        },
        {
          "transactionIndex": 0,
          "blockNumber": 47401359,
          "transactionHash": "0xced5ecfcb571469b0f39c0e698011163101d1a84e6d919d706f7395e8f4ddeda",
          "address": "0xB5A73A7Eb92F478661548dc4aF83a3924CeB6e83",
          "topics": [
            "0x110d160a1bedeea919a88fbc4b2a9fb61b7e664084391b6ca2740db66fef80fe",
            "0x000000000000000000000000ce19de22143cd60741306a2067aeec48135fb901",
            "0x000000000000000000000000ce19de22143cd60741306a2067aeec48135fb901",
            "0x0000000000000000000000000000000000000000000000000000000000000005"
          ],
          "data": "0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000ce19de22143cd60741306a2067aeec48135fb901000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000014000000000000000000000000000000000000000000000000000071afd498d0000000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000078cb519d35383930666166386566636434626134396336356534373737663730313064340000000000000000000000000000000000000000000000000000000000000037697066733a2f2f516d5470345741417956676f636e4578313847717a76377a4d6a386d514e76736673346f556373624763325969362f30000000000000000000",
          "logIndex": 5,
          "blockHash": "0x50b1c7de0926e83341e0ff8f1b1008231281026f8b91d805adf57ccc874965d2"
        },
        {
          "transactionIndex": 0,
          "blockNumber": 47401359,
          "transactionHash": "0xced5ecfcb571469b0f39c0e698011163101d1a84e6d919d706f7395e8f4ddeda",
          "address": "0x0000000000000000000000000000000000001010",
          "topics": [
            "0x4dfe1bbbcf077ddc3e01291eea2d5c70c2b422b415d95645b9adcfd678cb1d63",
            "0x0000000000000000000000000000000000000000000000000000000000001010",
            "0x000000000000000000000000ce19de22143cd60741306a2067aeec48135fb901",
            "0x000000000000000000000000c275dc8be39f50d12f66b6a63629c39da5bae5bd"
          ],
          "data": "0x000000000000000000000000000000000000000000000000002331d1f436540000000000000000000000000000000000000000000000000003e80df96762bb900000000000000000000000000000000000000000000014b9cb84c98826b0abbc00000000000000000000000000000000000000000000000003c4dc27732c67900000000000000000000000000000000000000000000014b9cba7fb5a1ae6ffbc",
          "logIndex": 6,
          "blockHash": "0x50b1c7de0926e83341e0ff8f1b1008231281026f8b91d805adf57ccc874965d2"
        }
      ],
      "blockNumber": 47401359,
      "confirmations": 1,
      "cumulativeGasUsed": {
        "type": "BigNumber",
        "hex": "0x0494a2"
      },
      "effectiveGasPrice": {
        "type": "BigNumber",
        "hex": "0x07aef40a0f"
      },
      "status": 1,
      "type": 2,
      "byzantium": true,
      "events": [
        {
          "transactionIndex": 0,
          "blockNumber": 47401359,
          "transactionHash": "0xced5ecfcb571469b0f39c0e698011163101d1a84e6d919d706f7395e8f4ddeda",
          "address": "0x0000000000000000000000000000000000001010",
          "topics": [
            "0xe6497e3ee548a3372136af2fcb0696db31fc6cf20260707645068bd3fe97f3c4",
            "0x0000000000000000000000000000000000000000000000000000000000001010",
            "0x000000000000000000000000ce19de22143cd60741306a2067aeec48135fb901",
            "0x000000000000000000000000b5a73a7eb92f478661548dc4af83a3924ceb6e83"
          ],
          "data": "0x00000000000000000000000000000000000000000000000000071afd498d000000000000000000000000000000000000000000000000000003c3c599b5870843000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003bcaa9c6bfa084300000000000000000000000000000000000000000000000000071afd498d0000",
          "logIndex": 0,
          "blockHash": "0x50b1c7de0926e83341e0ff8f1b1008231281026f8b91d805adf57ccc874965d2"
        },
        {
          "transactionIndex": 0,
          "blockNumber": 47401359,
          "transactionHash": "0xced5ecfcb571469b0f39c0e698011163101d1a84e6d919d706f7395e8f4ddeda",
          "address": "0xB5A73A7Eb92F478661548dc4aF83a3924CeB6e83",
          "topics": [
            "0xf8e1a15aba9398e019f0b49df1a4fde98ee17ae345cb5f6b5e2c27f5033e8ce7"
          ],
          "data": "0x0000000000000000000000000000000000000000000000000000000000000005",
          "logIndex": 1,
          "blockHash": "0x50b1c7de0926e83341e0ff8f1b1008231281026f8b91d805adf57ccc874965d2",
          "args": [
            {
              "type": "BigNumber",
              "hex": "0x05"
            }
          ],
          "event": "MetadataUpdate",
          "eventSignature": "MetadataUpdate(uint256)"
        },
        {
          "transactionIndex": 0,
          "blockNumber": 47401359,
          "transactionHash": "0xced5ecfcb571469b0f39c0e698011163101d1a84e6d919d706f7395e8f4ddeda",
          "address": "0xB5A73A7Eb92F478661548dc4aF83a3924CeB6e83",
          "topics": [
            "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
            "0x0000000000000000000000000000000000000000000000000000000000000000",
            "0x000000000000000000000000ce19de22143cd60741306a2067aeec48135fb901",
            "0x0000000000000000000000000000000000000000000000000000000000000005"
          ],
          "data": "0x",
          "logIndex": 2,
          "blockHash": "0x50b1c7de0926e83341e0ff8f1b1008231281026f8b91d805adf57ccc874965d2",
          "args": [
            "0x0000000000000000000000000000000000000000",
            "0xcE19De22143CD60741306a2067aEec48135fB901",
            {
              "type": "BigNumber",
              "hex": "0x05"
            }
          ],
          "event": "Transfer",
          "eventSignature": "Transfer(address,address,uint256)"
        },
        {
          "transactionIndex": 0,
          "blockNumber": 47401359,
          "transactionHash": "0xced5ecfcb571469b0f39c0e698011163101d1a84e6d919d706f7395e8f4ddeda",
          "address": "0xB5A73A7Eb92F478661548dc4aF83a3924CeB6e83",
          "topics": [
            "0x9d89e36eadf856db0ad9ffb5a569e07f95634dddd9501141ecf04820484ad0dc",
            "0x000000000000000000000000ce19de22143cd60741306a2067aeec48135fb901",
            "0x0000000000000000000000000000000000000000000000000000000000000005"
          ],
          "data": "0x00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000037697066733a2f2f516d5470345741417956676f636e4578313847717a76377a4d6a386d514e76736673346f556373624763325969362f30000000000000000000",
          "logIndex": 3,
          "blockHash": "0x50b1c7de0926e83341e0ff8f1b1008231281026f8b91d805adf57ccc874965d2",
          "args": [
            "0xcE19De22143CD60741306a2067aEec48135fB901",
            {
              "type": "BigNumber",
              "hex": "0x05"
            },
            "ipfs://QmTp4WAAyVgocnEx18Gqzv7zMj8mQNvsfs4oUcsbGc2Yi6/0"
          ],
          "event": "TokensMinted",
          "eventSignature": "TokensMinted(address,uint256,string)"
        },
        {
          "transactionIndex": 0,
          "blockNumber": 47401359,
          "transactionHash": "0xced5ecfcb571469b0f39c0e698011163101d1a84e6d919d706f7395e8f4ddeda",
          "address": "0x0000000000000000000000000000000000001010",
          "topics": [
            "0xe6497e3ee548a3372136af2fcb0696db31fc6cf20260707645068bd3fe97f3c4",
            "0x0000000000000000000000000000000000000000000000000000000000001010",
            "0x000000000000000000000000b5a73a7eb92f478661548dc4af83a3924ceb6e83",
            "0x00000000000000000000000016d4d960b9aa4d2278992b9d4fc13a25fdabcd6e"
          ],
          "data": "0x00000000000000000000000000000000000000000000000000071afd498d000000000000000000000000000000000000000000000000000000071afd498d0000000000000000000000000000000000000000000000000000068039a0a9ff453d00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000687549df38c453d",
          "logIndex": 4,
          "blockHash": "0x50b1c7de0926e83341e0ff8f1b1008231281026f8b91d805adf57ccc874965d2"
        },
        {
          "transactionIndex": 0,
          "blockNumber": 47401359,
          "transactionHash": "0xced5ecfcb571469b0f39c0e698011163101d1a84e6d919d706f7395e8f4ddeda",
          "address": "0xB5A73A7Eb92F478661548dc4aF83a3924CeB6e83",
          "topics": [
            "0x110d160a1bedeea919a88fbc4b2a9fb61b7e664084391b6ca2740db66fef80fe",
            "0x000000000000000000000000ce19de22143cd60741306a2067aeec48135fb901",
            "0x000000000000000000000000ce19de22143cd60741306a2067aeec48135fb901",
            "0x0000000000000000000000000000000000000000000000000000000000000005"
          ],
          "data": "0x0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000ce19de22143cd60741306a2067aeec48135fb901000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000014000000000000000000000000000000000000000000000000000071afd498d0000000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000078cb519d35383930666166386566636434626134396336356534373737663730313064340000000000000000000000000000000000000000000000000000000000000037697066733a2f2f516d5470345741417956676f636e4578313847717a76377a4d6a386d514e76736673346f556373624763325969362f30000000000000000000",
          "logIndex": 5,
          "blockHash": "0x50b1c7de0926e83341e0ff8f1b1008231281026f8b91d805adf57ccc874965d2",
          "args": [
            "0xcE19De22143CD60741306a2067aEec48135fB901",
            "0xcE19De22143CD60741306a2067aEec48135fB901",
            {
              "type": "BigNumber",
              "hex": "0x05"
            },
            [
              "0xcE19De22143CD60741306a2067aEec48135fB901",
              "0x0000000000000000000000000000000000000000",
              {
                "type": "BigNumber",
                "hex": "0x00"
              },
              "0x0000000000000000000000000000000000000000",
              "ipfs://QmTp4WAAyVgocnEx18Gqzv7zMj8mQNvsfs4oUcsbGc2Yi6/0",
              {
                "type": "BigNumber",
                "hex": "0x071afd498d0000"
              },
              "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
              {
                "type": "BigNumber",
                "hex": "0x00"
              },
              {
                "type": "BigNumber",
                "hex": "0x78cb519d"
              },
              "0x3538393066616638656663643462613439633635653437373766373031306434"
            ]
          ],
          "event": "TokensMintedWithSignature",
          "eventSignature": "TokensMintedWithSignature(address,address,uint256,(address,address,uint256,address,string,uint256,address,uint128,uint128,bytes32))"
        },
        {
          "transactionIndex": 0,
          "blockNumber": 47401359,
          "transactionHash": "0xced5ecfcb571469b0f39c0e698011163101d1a84e6d919d706f7395e8f4ddeda",
          "address": "0x0000000000000000000000000000000000001010",
          "topics": [
            "0x4dfe1bbbcf077ddc3e01291eea2d5c70c2b422b415d95645b9adcfd678cb1d63",
            "0x0000000000000000000000000000000000000000000000000000000000001010",
            "0x000000000000000000000000ce19de22143cd60741306a2067aeec48135fb901",
            "0x000000000000000000000000c275dc8be39f50d12f66b6a63629c39da5bae5bd"
          ],
          "data": "0x000000000000000000000000000000000000000000000000002331d1f436540000000000000000000000000000000000000000000000000003e80df96762bb900000000000000000000000000000000000000000000014b9cb84c98826b0abbc00000000000000000000000000000000000000000000000003c4dc27732c67900000000000000000000000000000000000000000000014b9cba7fb5a1ae6ffbc",
          "logIndex": 6,
          "blockHash": "0x50b1c7de0926e83341e0ff8f1b1008231281026f8b91d805adf57ccc874965d2"
        }
      ]
    }
  }
}
 */