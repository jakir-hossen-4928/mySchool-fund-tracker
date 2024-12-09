export const parseTextData = (text) => {
  const lines = text.split('\n').map(line => line.trim()).filter(line => line);
  const data = [];
  let currentDate = '';
  let currentEntry = null;

  lines.forEach(line => {
    const dateMatch = line.match(/^\d{2}\/\d{2}\/\d{4}/);
    
    if (dateMatch) {
      if (currentEntry) {
        data.push(currentEntry);
      }
      currentDate = dateMatch[0];
      currentEntry = {
        date: currentDate,
        transactions: []
      };
    } else if (currentEntry) {
      const amountMatch = line.match(/([\d,]+)\/=/);
      if (amountMatch) {
        const description = line.split(/[:=]/)[0].trim();
        const amount = amountMatch[1];
        currentEntry.transactions.push({
          description,
          amount
        });
      }
    }
  });

  if (currentEntry) {
    data.push(currentEntry);
  }

  return data;
};