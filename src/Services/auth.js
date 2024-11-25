
// Get token from local storage
const GetToken = () => {
    
    let token = localStorage.getItem('token');
    // redirect to login page if token is not found
    if (!token) return null; 
    return token;
}

const getRole = () => {
    let role = localStorage.getItem('role');
    if (!role) return 'user';
    return role;
} 

export { GetToken, getRole }; 