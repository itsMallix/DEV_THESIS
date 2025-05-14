export const daysLeft = (deadline) => {
  const difference = new Date(deadline).getTime() - Date.now();
  const remainingDays = difference / (1000 * 3600 * 24);

  return remainingDays.toFixed(0);
};

// export const daysLeft = (deadline) => {
//   const now = new Date();
//   const endTime = new Date(deadline);

//   const timeDiff = endTime - now;

//   if (timeDiff <= 0) {
//       return { hours: 0, minutes: 0, seconds: 0 }; // Deadline passed
//   }

//   const hours = Math.floor(timeDiff / (1000 * 60 * 60));
//   const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
//   const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

//   return { hours, minutes, seconds };
// };


export const calculateBarPercentage = (goal, raisedAmount) => {
  const percentage = Math.round((raisedAmount * 100) / goal);

  return percentage;
};

export const checkIfImage = (url, callback) => {
  const img = new Image();
  img.src = url;

  if (img.complete) callback(true);

  img.onload = () => callback(true);
  img.onerror = () => callback(false);
};
