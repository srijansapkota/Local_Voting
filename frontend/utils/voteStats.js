export const getVoteStats = (positive = 0, negative = 0) =>{
    const total = positive + negative;
    return{
        total,
        positivePercentage : total ? (positive/total) * 100 : 0,
        negativePercentage : total ? (negative/total) * 100 : 0,
    }
}