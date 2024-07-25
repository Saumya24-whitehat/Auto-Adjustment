function identifyPositionType(positions) {
  let positionType = "Unknown Strategy";

  if (positions.length === 1) {
    const pos = positions[0];
    if (pos.type === 'CALL' && pos.action === 'BUY') {
      positionType = "Long Call";
    } else if (pos.type === 'PUT' && pos.action === 'BUY') {
      positionType = "Long Put";
    } else if (pos.type === 'CALL' && pos.action === 'SELL') {
      positionType = "Short Call";
    } else if (pos.type === 'PUT' && pos.action === 'SELL') {
      positionType = "Short Put";
    }
  } else if (positions.length === 2) {
    const [pos1, pos2] = positions;
    if (pos1.type === 'CALL' && pos2.type === 'CALL') {
      if (pos1.action === 'SELL' && pos2.action === 'BUY') {
        if (pos1.strikePrice < pos2.strikePrice && (pos1.quantity === 1 && pos2.quantity === 2 || pos1.quantity === 2 && pos2.quantity === 1)) {
          positionType = "Call Ratio Back Spread";
        } else if (pos1.strikePrice > pos2.strikePrice && pos1.quantity === pos2.quantity) {
          positionType = "Bull Call Spread";
        } else if (pos1.strikePrice < pos2.strikePrice && pos1.quantity === pos2.quantity) {
          positionType = "Bear Call Spread";
        }
      }
    } else if (pos1.type === 'PUT' && pos2.type === 'PUT') {
      if (pos1.action === 'SELL' && pos2.action === 'BUY' &&
          pos1.strikePrice > pos2.strikePrice && (pos1.quantity === 1 && pos2.quantity === 2 || pos1.quantity === 2 && pos2.quantity === 1)) {
        positionType = "Put Ratio Back Spread";
      } else if (pos1.action === 'SELL' && pos2.action === 'BUY' &&
                 pos1.strikePrice > pos2.strikePrice && pos1.quantity === pos2.quantity) {
        positionType = "Bull Put Spread";
      } else if (pos1.action === 'SELL' && pos2.action === 'BUY' &&
                 pos1.strikePrice < pos2.strikePrice && pos1.quantity === pos2.quantity) {
        positionType = "Bear Put Spread";
      }
    } else if (pos1.type === 'CALL' && pos2.type === 'PUT') {
      if (pos1.action === 'BUY' && pos2.action === 'BUY' &&
          pos1.strikePrice === pos2.strikePrice && pos1.quantity === pos2.quantity) {
        positionType = "Buy Straddle";
      } else if (pos1.action === 'SELL' && pos2.action === 'SELL' &&
                 pos1.strikePrice === pos2.strikePrice && pos1.quantity === pos2.quantity) {
        positionType = "Sell Straddle";
      } else if (pos1.action === 'BUY' && pos2.action === 'BUY' &&
        pos1.strikePrice != pos2.strikePrice && pos1.quantity === pos2.quantity) {
        positionType = "Buy Strangle";
      } else if (pos1.action === 'SELL' && pos2.action === 'SELL' &&
                pos1.strikePrice != pos2.strikePrice && pos1.quantity === pos2.quantity) {
        positionType = "Sell Strangle";
      }
    }
  } else if (positions.length === 3) {
    const [pos1, pos2, pos3] = positions;
    if (pos1.type === 'CALL' && pos2.type === 'CALL' && pos3.type === 'CALL') {
      if (pos1.action === 'SELL' && pos2.action === 'BUY' && pos3.action === 'BUY') {
        if (pos1.strikePrice < pos2.strikePrice && pos2.strikePrice < pos3.strikePrice &&
            pos1.quantity === 1 && pos2.quantity === 1 && pos3.quantity === 1) {
          positionType = "Bear Call Ladder";
        }
      }
    } else if (pos1.type === 'PUT' && pos2.type === 'PUT' && pos3.type === 'PUT') {
      if (pos1.action === 'SELL' && pos2.action === 'BUY' && pos3.action === 'BUY') {
        if (pos1.strikePrice > pos2.strikePrice && pos2.strikePrice > pos3.strikePrice &&
            pos1.quantity === 1 && pos2.quantity === 1 && pos3.quantity === 1) {
          positionType = "Bear Put Ladder";
        }
      }
    } 
  } else if (positions.length === 4) {
    const [pos1, pos2, pos3, pos4] = positions;
    if (pos1.type === 'CALL' && pos2.type === 'CALL' && pos3.type === 'CALL' && pos4.type === 'CALL') {
      if (pos1.action === 'SELL' && pos2.action === 'SELL' && pos3.action === 'BUY' && pos4.action === 'BUY') {
        if (
          pos1.strikePrice === Math.min(pos2.strikePrice, pos3.strikePrice, pos1.strikePrice, pos4.strikePrice) &&
          pos2.strikePrice === Math.max(pos2.strikePrice, pos3.strikePrice, pos1.strikePrice, pos4.strikePrice) &&
          pos1.strikePrice < pos3.strikePrice && pos3.strikePrice < pos4.strikePrice && pos4.strikePrice < pos2.strikePrice
        ) {
          positionType = "Long Call Condor";
        }else if (
          pos3.strikePrice === Math.min(pos2.strikePrice, pos3.strikePrice, pos1.strikePrice, pos4.strikePrice) &&
          pos4.strikePrice === Math.max(pos2.strikePrice, pos3.strikePrice, pos1.strikePrice, pos4.strikePrice) &&
          pos3.strikePrice < pos1.strikePrice && pos1.strikePrice < pos2.strikePrice && pos2.strikePrice < pos4.strikePrice
        ) {
          positionType = "Short Call Condor";
        }
      }
    } else if (pos1.type === 'PUT' && pos2.type === 'PUT' && pos3.type === 'PUT' && pos4.type === 'PUT') {
      if (pos1.action === 'SELL' && pos2.action === 'SELL' && pos3.action === 'BUY' && pos4.action === 'BUY') {
        if (
          pos1.strikePrice === Math.min(pos2.strikePrice, pos3.strikePrice, pos1.strikePrice, pos4.strikePrice) &&
          pos2.strikePrice === Math.max(pos2.strikePrice, pos3.strikePrice, pos1.strikePrice, pos4.strikePrice) &&
          pos1.strikePrice < pos3.strikePrice && pos3.strikePrice < pos4.strikePrice && pos4.strikePrice < pos2.strikePrice
        ) {
          positionType = "Long Put Condor";
        }else if (
          pos3.strikePrice === Math.min(pos2.strikePrice, pos3.strikePrice, pos1.strikePrice, pos4.strikePrice) &&
          pos4.strikePrice === Math.max(pos2.strikePrice, pos3.strikePrice, pos1.strikePrice, pos4.strikePrice) &&
          pos3.strikePrice < pos1.strikePrice && pos1.strikePrice < pos2.strikePrice && pos2.strikePrice < pos4.strikePrice
        ) {
          positionType = "Short Put Condor";
        }
      }
    }
  }

  return positionType;
}


// Function to recommend adjustments
function recommendAdjustment(input, marketOutlook) {
  const { positions, indexAtEntry, indexCurrent } = input;
  const positionType = identifyPositionType(positions);
  const daysToExpiration = (new Date(positions[0].expirationDate) - new Date()) / (1000 * 60 * 60 * 24);
  const indexChange = indexCurrent / indexAtEntry - 1;

  console.log(positionType)
  if (positionType === 'Long Call') {
      const { strikePrice, currentPrice, entryPrice } = positions[0];

      if (indexChange >= 0.002 && marketOutlook === 'bullish') {
          return `Exit the Call @ ${currentPrice} with a P/L of ${currentPrice - entryPrice} and Buy a Call with a higher strike price.`;
      } else if (daysToExpiration <= 2 && marketOutlook === 'bullish') {
          return `Exit the Call @ ${currentPrice} with a P/L of ${entryPrice - currentPrice} and Buy a Call with the same strike price but a later expiration date.`;
      } else if (indexChange >= 0.001 && (marketOutlook === 'neutral' || marketOutlook === 'bullish')) {
          return `Convert to a Bull Call Spread: Sell a Call with a strike price higher than ${strikePrice}. \n or \nConvert to a Calendar Spread: Sell a Call with the same strike price but a nearer expiration date.`;
      } else if (marketOutlook === 'bearish') {
          return `Buy a Protective Put to hedge against downside risk.`;
      } else if (marketOutlook === 'very bullish') {
          return `Buy additional Calls to increase exposure.`;
      } else if(marketOutlook === 'neutral' && indexChange<-0.002){
        return `Exit the position`
      } else {
          return `Hold the current Call position.`;
      }
  } else if (positionType === 'Long Put') {
      const { strikePrice, currentPrice, entryPrice } = positions[0];
      // console.log(indexChange)
      if (indexChange <= -0.002 && marketOutlook === 'bearish') {
          return `Exit the Put @ ${currentPrice} with a P/L of ${currentPrice - entryPrice} and Buy a Put with a lower strike price.`;
      } else if (daysToExpiration <= 2 && marketOutlook === 'bearish') {
          return `Exit the Put @ ${currentPrice} with a P/L of ${entryPrice - currentPrice} and Buy a Put with the same strike price but a later expiration date.`;
      } else if (indexChange <= -0.001 && (marketOutlook === 'neutral' || marketOutlook === 'bearish') ) {
          return `Convert to a Bear Put Spread: Sell a Put with a strike price lower than ${strikePrice}. \n or \nConvert to a Calendar Spread: Sell a Put with the same strike price but a nearer expiration date.`;
      } else if (marketOutlook === 'bullish') {
          return `Buy a Protective Call to hedge against upside risk.`;
      } else if (marketOutlook === 'very bearish') {
          return `Buy additional Puts to increase exposure.`;
      } else if(marketOutlook === 'neutral' && indexChange>0.002){
        return `Exit the position`
      } else {
          return `Hold the current Put position.`;
      }
  } else if (positionType === 'Short Call') {
      const { strikePrice, currentPrice, entryPrice } = positions[0];
      if (indexChange <= -0.002 && marketOutlook === 'bearish') {
          return `Close the short Call @ ${currentPrice} with a P/L of ${entryPrice - currentPrice} and Sell another Call with a higher strike price.`;
      } else if (daysToExpiration <= 2 && marketOutlook === 'bearish') {
          return `Close the short Call @ ${currentPrice} with a P/L of ${entryPrice - currentPrice} and Sell another Call with the same strike price but a later expiration date.`;
      } else if (indexChange <= -0.001 && (marketOutlook === 'neutral' || marketOutlook === 'bearish')) {
          return `Convert to an Bear Call Spread: Buy a Call with a strike price higher than ${strikePrice}`;
      } else if ((marketOutlook === 'bullish')) {
          return `Buy a Protective Call to hedge against upside risk. Preferably a strike price higher than ${strikePrice}`;
      } else if (marketOutlook === 'very bullish') {
          return `Buy a Protective Call to hedge against upside risk. Preferably a strike price lower than ${strikePrice}`;
      } else if(indexChange>0.002 && marketOutlook === 'neutral'){
        return `Exit the position`
      } else {
          return `Hold the current short Call position.`;
      }
  } else if (positionType === 'Short Put') {
    const { strikePrice, currentPrice, entryPrice } = positions[0];

    if (indexChange >= 0.002 && marketOutlook === 'bullish') {
        return `Close the short Put @ ${currentPrice} with a P/L of ${entryPrice - currentPrice} and Sell another Put with a lower strike price.`;
    } else if (daysToExpiration <= 2 && marketOutlook === 'bullish') {
        return `Close the short Put @ ${currentPrice} with a P/L of ${entryPrice - currentPrice} and Sell another Put with the same strike price but a later expiration date.`;
    } else if (indexChange <= 0.001 && (marketOutlook === 'neutral' || marketOutlook === 'bullish')) {
        return `Convert to a Bull Put Spread: Buy a Put with a strike price lower than ${strikePrice}.`;
    } else if (marketOutlook === 'bearish' || marketOutlook === 'neutral') {
        return `Buy a Protective Put to hedge against downside risk. Preferably a strike price lower than ${strikePrice}.`;
    } else if (marketOutlook === 'very bearish') {
        return `Buy a Protective Put to hedge against downside risk. Preferably a strike price higher than ${strikePrice}.`;
    } else if(indexChange<-0.002 && marketOutlook === 'neutral'){
      return `Exit the position`
    }  else {
        return `Hold the current short Put position.`;
    }
  } else if (positionType === 'Bull Call Spread') {
      const { strikePrice: strikePrice1, currentPrice: currentPrice1, entryPrice: entryPrice1 } = positions[0];
      const { strikePrice: strikePrice2, currentPrice: currentPrice2, entryPrice: entryPrice2 } = positions[1];

      if (indexChange >= 0.002 && marketOutlook === 'bullish') {
          return `Exit the Sold Call @ ${currentPrice1} with a P/L of ${entryPrice1-currentPrice1} and consider Selling a new call of a strike higher than ${strikePrice1}.`;
      } else if (currentPrice1/entryPrice1-1 <= -0.4 && (marketOutlook === 'neutral' || marketOutlook === 'bullish')) {
          return `Exit the Sold Call @ ${currentPrice1} with a P/L of ${entryPrice1-currentPrice1} and consider Selling a new call of a premium closer to ${entryPrice1*.6}.  Make sure the Option is OTM or ATM, if ITM sell a put option with strike price higher than ${strikePrice1}.`;
      } else if (daysToExpiration < 2 && marketOutlook === 'bullish') {
          return `Exit the Bull Call Spread @ ${currentPrice1} and ${currentPrice2} and enter a new Bull Call Spread with the same strike prices but a later expiration date.`;
      } else if (marketOutlook === 'bearish' || marketOutlook === 'very bearish') {
          return `Buy a Put Option with a premium of ${(strikePrice1-strikePrice2)-(entryPrice2-entryPrice1)}`;
      } else if (marketOutlook === 'very bullish') {
          return `Hold the Bull Call Spread for further gains.`;
      } else {
          return `Hold the current Bull Call Spread position.`;
      }
  } else if (positionType === 'Bear Call Spread') {
    const { strikePrice: strikePrice1, currentPrice: currentPrice1, entryPrice: entryPrice1 } = positions[0];
    const { strikePrice: strikePrice2, currentPrice: currentPrice2, entryPrice: entryPrice2 } = positions[1];

    if (indexChange <= -0.002 && marketOutlook === 'bearish') {
        return `Exit the Bougth Call @ ${currentPrice2} with a P/L of ${entryPrice2-currentPrice2} and consider Buying a new call of a premium closer to ${entryPrice2}.`;
    } else if (currentPrice1/entryPrice1-1 <= -0.4 && (marketOutlook === 'neutral' || marketOutlook === 'bearish')) {
        return `Exit the Sold Call @ ${currentPrice1} with a P/L of ${entryPrice1-currentPrice1} and consider Selling a new call of a premium closer to ${entryPrice1*.6}. Make sure the Option is OTM or ATM, if ITM sell a call option with strike price lower than ${strikePrice1}`;
    } else if (daysToExpiration < 2 && marketOutlook === 'bearish') {
        return `Exit the Bull Call Spread @ ${currentPrice1} and ${currentPrice2} and enter a new Bull Call Spread with the same strike prices but a later expiration date.`;
    } else if (marketOutlook === 'bullish' || marketOutlook === 'very bullish') {
        return `Buy a Call Option with a premium of ${(strikePrice1-strikePrice2)-(entryPrice2-entryPrice1)}`;
    } else if (marketOutlook === 'very bearish') {
        return `Hold the Bear Call Spread for further gains.`;
    } else {
        return `Hold the current Bear Call Spread position.`;
    }
  } else if (positionType === 'Bull Put Spread') {
    const { strikePrice: strikePrice1, currentPrice: currentPrice1, entryPrice: entryPrice1 } = positions[0];
    const { strikePrice: strikePrice2, currentPrice: currentPrice2, entryPrice: entryPrice2 } = positions[1];

    if (indexChange >= 0.002 && marketOutlook === 'bullish') {
        return `Exit the Bougth Put @ ${currentPrice2} with a P/L of ${entryPrice2 - currentPrice2} and consider Buying a new put of a premium closer to ${entryPrice2}.`;
    } else if (currentPrice1 / entryPrice1 - 1 <= -0.4 && (marketOutlook === 'neutral' || marketOutlook === 'bullish')) {
        return `Exit the Sold Put @ ${currentPrice1} with a P/L of ${entryPrice1 - currentPrice1} and consider Selling a new put of a premium closer to ${entryPrice1 * 0.6}.  Make sure the Option is OTM or ATM, if ITM sell a call option with strike price higher than ${strikePrice1}`;
    } else if (daysToExpiration < 2 && marketOutlook === 'bullish') {
        return `Exit the Bull Put Spread @ ${currentPrice1} and ${currentPrice2} and enter a new Bull Put Spread with the same strike prices but a later expiration date.`;
    } else if (marketOutlook === 'bearish' || marketOutlook === 'very bearish') {
        return `Buy a Put Option with a premium of ${(strikePrice2 - strikePrice1) - (entryPrice1 - entryPrice2)}.`;
    } else if (marketOutlook === 'very bullish') {
        return `Hold the Bull Put Spread for further gains.`;
    } else {
        return `Hold the current Bull Put Spread position.`;
    }
  } else if (positionType === 'Bear Put Spread') {
    const { strikePrice: strikePrice1, currentPrice: currentPrice1, entryPrice: entryPrice1 } = positions[0];
    const { strikePrice: strikePrice2, currentPrice: currentPrice2, entryPrice: entryPrice2 } = positions[1];

    if (indexChange <= -0.002 && marketOutlook === 'bearish') {
        return `Exit the Sold Put @ ${currentPrice1} with a P/L of ${entryPrice1-currentPrice1} and consider Selling a new call of a strike higher than ${strikePrice1}.`;
    } else if (currentPrice1 / entryPrice1 - 1 <= -0.4 && (marketOutlook === 'neutral' || marketOutlook === 'bearish')) {
        return `Exit the Sold Put @ ${currentPrice1} with a P/L of ${entryPrice1 - currentPrice1} and consider Selling a new put of a premium closer to ${entryPrice1 * 0.6}. Make sure the Option is OTM or ATM, if ITM sell a put option with strike price lower than ${strikePrice1}.`;
    } else if (daysToExpiration < 2 && marketOutlook === 'bearish') {
        return `Exit the Bear Put Spread @ ${currentPrice1} and ${currentPrice2} and enter a new Bear Put Spread with the same strike prices but a later expiration date.`;
    } else if (marketOutlook === 'bullish' || marketOutlook === 'very bullish') {
        return `Buy a Call Option or a premium of ${(strikePrice1 - strikePrice2) - (entryPrice2 - entryPrice1)}.`;
    } else if (marketOutlook === 'very bearish') {
        return `Hold the Bear Put Spread for further gains.`;
    } else {
        return `Hold the current Bear Put Spread position.`;
    }
  }else {
      return `Invalid position type or action. Please specify a valid position.`;
  }
}

// Function to test recommendations
function runTests() {
    const tests = [
        {
            "input": {
                "positions": [
                  { "type": "CALL", "action": "BUY", "strikePrice": 100, "quantity": 1, "entryPrice": 10, "currentPrice": 15, "expirationDate": "2024-07-31" }],
                "indexAtEntry": 100,
                "indexCurrent": 105
            },
            "marketOutlook": "bullish",
            "expected": "Exit the Call @ 15 with a P/L of 5 and Buy a Call with a higher strike price."
        },
        {
            "input": {
                "positions": [{ "type": "CALL", "action": "BUY", "strikePrice": 100, "quantity": 1, "entryPrice": 10, "currentPrice": 8, "expirationDate": "2024-07-31" }],
                "indexAtEntry": 100,
                "indexCurrent": 95
            },
            "marketOutlook": "bullish",
            "expected": "Hold the current Call position."
        },
        {
            "input": {
                "positions": [{ "type": "PUT", "action": "BUY", "strikePrice": 100, "quantity": 1, "entryPrice": 5, "currentPrice": 8, "expirationDate": "2024-07-31" }],
                "indexAtEntry": 100,
                "indexCurrent": 95
            },
            "marketOutlook": "bearish",
            "expected": "Exit the Put @ 8 with a P/L of 3 and Buy a Put with a lower strike price."
        },
        {
            "input": {
                "positions": [{ "type": "PUT", "action": "BUY", "strikePrice": 100, "quantity": 1, "entryPrice": 5, "currentPrice": 2, "expirationDate": "2024-07-31" }],
                "indexAtEntry": 100,
                "indexCurrent": 105
            },
            "marketOutlook": "neutral",
            "expected": "Exit the position"
        },
        {
            "input": {
                "positions": [{ "type": "CALL", "action": "SELL", "strikePrice": 100, "quantity": 1, "entryPrice": 10, "currentPrice": 8, "expirationDate": "2024-07-31" }],
                "indexAtEntry": 100,
                "indexCurrent": 95
            },
            "marketOutlook": "bearish",
            "expected": "Close the short Call @ 8 with a P/L of 2 and Sell another Call with a higher strike price."
        },
        {
            "input": {
                "positions": [{ "type": "CALL", "action": "SELL", "strikePrice": 100, "quantity": 1, "entryPrice": 10, "currentPrice": 15, "expirationDate": "2024-07-31" }],
                "indexAtEntry": 100,
                "indexCurrent": 105
            },
            "marketOutlook": "neutral",
            "expected": "Exit the position"
        },
        {
            "input": {
                "positions": [{ "type": "PUT", "action": "SELL", "strikePrice": 100, "quantity": 1, "entryPrice": 10, "currentPrice": 8, "expirationDate": "2024-07-31" }],
                "indexAtEntry": 100,
                "indexCurrent": 105
            },
            "marketOutlook": "bullish",
            "expected": "Close the short Put @ 8 with a P/L of 2 and Sell another Put with a lower strike price."
        },
        {
            "input": {
                "positions": [{ "type": "PUT", "action": "SELL", "strikePrice": 100, "quantity": 1, "entryPrice": 10, "currentPrice": 12, "expirationDate": "2024-07-31" }],
                "indexAtEntry": 100,
                "indexCurrent": 95
            },
            "marketOutlook": "neutral",
            "expected": "Convert to a Bull Put Spread: Buy a Put with a strike price lower than 100."
        },
        {
            "input": {
                "positions": [
                    { "type": "CALL", "action": "SELL", "strikePrice": 110, "quantity": 1, "entryPrice": 3, "currentPrice": 4, "expirationDate": "2024-07-31" },
                    { "type": "CALL", "action": "BUY", "strikePrice": 100, "quantity": 1, "entryPrice": 5, "currentPrice": 8, "expirationDate": "2024-07-31" }
                ],
                "indexAtEntry": 100,
                "indexCurrent": 105
            },
            "marketOutlook": "bullish",
            "expected": "Exit the Sold Call @ 4 with a P/L of -1 and consider Selling a new call of a strike higher than 110."
        },
        {
            "input": {
                "positions": [
                    { "type": "CALL", "action": "SELL", "strikePrice": 110, "quantity": 1, "entryPrice": 3, "currentPrice": 6, "expirationDate": "2024-07-31" },
                    { "type": "CALL", "action": "BUY", "strikePrice": 100, "quantity": 1, "entryPrice": 5, "currentPrice": 8, "expirationDate": "2024-07-31" }
                ],
                "indexAtEntry": 100,
                "indexCurrent": 95
            },
            "marketOutlook": "bearish",
            "expected": "Buy a Put Option with a premium of 8"
        },
        {
            "input": {
                "positions": [
                    { "type": "CALL", "action": "SELL", "strikePrice": 100, "quantity": 1, "entryPrice": 5, "currentPrice": 3, "expirationDate": "2024-07-31" },
                    { "type": "CALL", "action": "BUY", "strikePrice": 110, "quantity": 1, "entryPrice": 2, "currentPrice": 1, "expirationDate": "2024-07-31" }
                ],
                "indexAtEntry": 100,
                "indexCurrent": 95
            },
            "marketOutlook": "bearish",
            "expected": "Hold the Bear Call Spread for further gains."
        },
        {
            "input": {
                "positions": [
                    { "type": "PUT", "action": "SELL", "strikePrice": 90, "quantity": 1, "entryPrice": 3, "currentPrice": 4, "expirationDate": "2024-07-31" },
                    { "type": "PUT", "action": "BUY", "strikePrice": 100, "quantity": 1, "entryPrice": 5, "currentPrice": 8, "expirationDate": "2024-07-31" }
                ],
                "indexAtEntry": 100,
                "indexCurrent": 95
            },
            "marketOutlook": "bearish",
            "expected": "Hold the Bear Put Spread for further gains."
        },
        {
            "input": {
                "positions": [
                    { "type": "PUT", "action": "SELL", "strikePrice": 90, "quantity": 1, "entryPrice": 3, "currentPrice": 6, "expirationDate": "2024-07-31" },
                    { "type": "PUT", "action": "BUY", "strikePrice": 100, "quantity": 1, "entryPrice": 5, "currentPrice": 8, "expirationDate": "2024-07-31" }
                ],
                "indexAtEntry": 100,
                "indexCurrent": 105
            },
            "marketOutlook": "bullish",
            "expected": "Buy a Call Option or a premium of 2."
        }
    ];

  let passed = 0;
  for (const test of tests) {
      const recommendation = recommendAdjustment(test.input,  test.marketOutlook);
      if (recommendation === test.expected) {
          console.log(`Test passed!`);
          passed++;
      } else {
          console.log(`Test failed! Expected: "${test.expected}", but got: "${recommendation}"`);
      }
  }
  console.log(`${passed} out of ${tests.length} tests passed.`);
}

// Run the tests
runTests();