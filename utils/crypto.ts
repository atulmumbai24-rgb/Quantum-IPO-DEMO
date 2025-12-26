export const generateSHA256 = async (message: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
};

// ANU QRNG Mock Data (Subset)
const RAW_QRNG_VALUES = [
  58409, 21871, 49678, 13773, 39088, 53903, 65060, 62704, 47620, 32814,
  37469, 5656, 367, 46396, 57116, 55607, 31436, 42, 40256, 5658,
  47100, 48629, 37280, 23116, 32167, 43211, 860, 57986, 41529, 44508,
  11108, 24784, 20165, 4157, 30643, 36401, 64199, 20741, 56941, 24713,
  54594, 59808, 5271, 11577, 24112, 52644, 55950, 38246, 103, 1488,
  53174, 28768, 21470, 3096, 43380, 9594, 42667, 28300, 9551, 42752
];

export const getQRNGStream = (offset: number, count: number) => {
  const result = [];
  for (let i = 0; i < count; i++) {
    const dataIndex = (offset + i) % RAW_QRNG_VALUES.length;
    result.push({
      index: dataIndex + 1,
      value: RAW_QRNG_VALUES[dataIndex]
    });
  }
  return result;
};

export const getQRNGMetadata = () => ({
  source: "ANU Quantum Random Numbers Server",
  maxValue: 65535,
});