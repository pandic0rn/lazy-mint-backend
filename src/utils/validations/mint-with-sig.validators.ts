//see to use joi instaed: https://mahmoud-kassem.medium.com/the-2024-guide-to-using-middleware-for-data-validation-in-node-js-express-api-c86590d0ddec
import { Request, Response, NextFunction } from "express";

export const validateMintWithSignatureRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Get data from request body
  // see https://github.com/thirdweb-dev/contracts/blob/main/contracts/prebuilts/token/signatureMint.md for exact specifications
  /*
  struct MintRequest {
    address to;
    address royaltyRecipient;
    uint256 royaltyBps;
    address primarySaleRecipient;
    uint256 tokenId;
    string uri;
    uint256 quantity;
    uint256 pricePerToken;
    address currency;
    uint128 validityStartTimestamp;
    uint128 validityEndTimestamp;
    bytes32 uid;
}
Parameter	Description
to	The receiver of the tokens to mint.
royaltyRecipient	The recipient of the minted token's secondary sales royalties. (Not applicable for ERC20 tokens)
royaltyBps	The percentage of the minted token's secondary sales to take as royalties. (Not applicable for ERC20 tokens)
primarySaleRecipient	The recipient of the minted token's primary sales proceeds.
tokenId	The tokenId of the token to mint. (Only applicable for ERC1155 tokens)
uri	The metadata URI of the token to mint. (Not applicable for ERC20 tokens)
quantity	The quantity of tokens to mint.
pricePerToken	The price to pay per quantity of tokens minted. (For TokenERC20, this parameter is price, indicating the total price of all tokens)
currency	The currency in which to pay the price per token minted.
validityStartTimestamp	The unix timestamp after which the payload is valid.
validityEndTimestamp	The unix timestamp at which the payload expires.
uid	A unique identifier for the payload. */

  const {
    to,
    royaltyRecipient,
    royaltyBps,
    primarySaleRecipient,
    tokenId,
    uri,
    quantity,
    pricePerToken,
    currency,
    validityStartTimestamp,
    validityEndTimestamp,
    uid,
  } = req.body;
  // Create an array to store errors
  const errors = [];
  //generate all the if const not there in body then errors push fieldname is missing
  // Check if each required field is missing and push an error message if it is
  if (!to) {
    errors.push("to field is required");
  } else {
    // Add more validations here
    // e.g. password must be at least 8 chars long
    if (typeof to !== "string" || !/^0x[a-fA-F0-9]{40}$/.test(to)) {
      errors.push("to field is required and must be a valid Ethereum address");
    }
  }
  if (!royaltyRecipient) {
    errors.push("royaltyRecipient field is required");
  } else {
    if (
      typeof royaltyRecipient !== "string" ||
      !/^0x[a-fA-F0-9]{40}$/.test(royaltyRecipient)
    ) {
      errors.push(
        "royaltyRecipient field is required and must be a valid Ethereum address"
      );
    }
  }
  if (!royaltyBps) {
    errors.push("royaltyBps field is required");
  } else {
    if (!Number.isInteger(royaltyBps) || royaltyBps < 0 || royaltyBps > 100) {
      errors.push(
        "royaltyBps field is required and must be an integer between 0 and 100"
      );
    }
  }
  if (!primarySaleRecipient) {
    errors.push("primarySaleRecipient field is required");
  } else {
    if (
      typeof primarySaleRecipient !== "string" ||
      !/^0x[a-fA-F0-9]{40}$/.test(primarySaleRecipient)
    ) {
      errors.push(
        "primarySaleRecipient field is required and must be a valid Ethereum address"
      );
    }
  }
  if (!tokenId) {
    errors.push("tokenId field is required");
  } else {
    if (!Number.isInteger(tokenId) || tokenId < 0) {
      errors.push(
        "tokenId field is required and must be a non-negative integer"
      );
    }
  }
  if (!uri) {
    errors.push("uri field is required");
  } else {
    if (typeof uri !== "string") {
      errors.push("uri field is required and must be a string");
    }
  }
  if (!quantity) {
    errors.push("quantity field is required");
  } else {
    if (!Number.isInteger(quantity) || quantity <= 0) {
      errors.push("quantity field is required and must be a positive integer");
    }
  }
  if (!pricePerToken) {
    errors.push("pricePerToken field is required");
  } else {
    if (!Number.isInteger(pricePerToken) || pricePerToken <= 0) {
      errors.push(
        "pricePerToken field is required and must be a positive integer"
      );
    }
  }
  if (!currency) {
    errors.push("currency field is required");
  } else {
    if (typeof currency !== "string" || !/^0x[a-fA-F0-9]{40}$/.test(currency)) {
      errors.push(
        "currency field is required and must be a valid Ethereum address"
      );
    }
  }
  if (!validityStartTimestamp) {
    errors.push("validityStartTimestamp field is required");
  } else {
    if (
      !Number.isInteger(validityStartTimestamp) ||
      validityStartTimestamp < 0
    ) {
      errors.push(
        "validityStartTimestamp field is required and must be a non-negative integer"
      );
    }
  }
  if (!validityEndTimestamp) {
    errors.push("validityEndTimestamp field is required");
  } else {
    if (!Number.isInteger(validityEndTimestamp) || validityEndTimestamp < 0) {
      errors.push(
        "validityEndTimestamp field is required and must be a non-negative integer"
      );
    }
  }
  if (!uid) {
    errors.push("uid field is required");
  } else {
    if (typeof uid !== "string" || !/^0x[a-fA-F0-9]{64}$/.test(uid)) {
      errors.push("uid field is required and must be a valid Ethereum address");
    }
  }

  // If there are errors
  // return 422 (Unprocessable Entity)
  if (errors.length) {
    return res.status(422).json({
      message: "Validation failed",
      errors,
    });
  }

  // Pass user data to the next middleware
  next();
};
