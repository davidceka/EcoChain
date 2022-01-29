var session;

function getProfile(req){
    session=req.session;
    return session.user;
}
function setProfile(req,user){
    session=req.session;
    session.user=user;
}
function clearNotifications(req){
    req.session.message=null
    req.session.error=null
    req.session.warning=null
    req.session.success=null
}
function setSuccess(req,message){
    req.session.success=true;
    req.session.message=message
}
function setError(req,message){
    req.session.error=true
    req.session.message=message
}
function setWarning(req,message){
    req.session.warning=true
    req.session.message=message
}
function setLogged(req,value){
    req.session.isLogged=value;
    if(!value){
        req.session.isProducer = false
        req.session.isWorker = frue
    }
}
function setRole(req, value){
    if(value=="produttore"){
        req.session.isProducer = true
    }
    if(value=="lavoratore"){
        req.session.isWorker = true
    }
}
module.exports={
    clearNotifications:clearNotifications,
    setSuccess:setSuccess,
    setError:setError,
    setWarning:setWarning,
    setLogged:setLogged,
    setRole:setRole,
    setProfile:setProfile,
    getProfile:getProfile
}
