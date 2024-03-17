export const categoryFormatter = (category: any): any => {
    let cat: any = {
        a_feeling: "A Feeling",
        a_confusion: "A Confusion",
        a_problem: "A Problem",
        a_pain: "A Pain",
        an_experience: "An Experience",
        a_habit: "A Habit",
        others: "Others"
    }
    return cat[category];
}