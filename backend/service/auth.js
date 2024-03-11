const sessionIdTOUseMap = new Map();

function setUser(id,user)
{
    sessionIdTOUseMap.set(id,user);
}

function getUser(id)
{
    return sessionIdTOUseMap(id);
}

module.exports = {setUser,getUser};