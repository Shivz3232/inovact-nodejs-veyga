const getUserId = `query getUserId($cognito_sub : String){
    user(where : {cognito_sub : {_eq : $cognito_sub}}){
        id,
        status
    }
}`;

module.exports = {
  getUserId,
};
