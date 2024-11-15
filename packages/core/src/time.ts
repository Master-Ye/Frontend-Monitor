let diff = 0;
export const diffTime = (date: string) => {
  const serverDate = new Date(date);
  const inDiff = Date.now() - serverDate.getTime();
  if (diff === 0 || diff > inDiff) {
    diff = inDiff;
  }
};

export const getTime = () => {
  return new Date(Date.now() - diff);
};
