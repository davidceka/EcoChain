var session;

function getProfile(req){
    session=req.session;
    return session.user;
}
function setProfile(req,user){
    session=req.session;
    session.user=user;
}

function setListProducers(req,producers){
    req.session.producers=producers
}

function getListProducers(req){
    return req.session.producers;
}

function setListRawMaterial(req, listRawMaterials){
    req.session.selectedMaterials=listRawMaterials
}

function getListRawMaterial(req){
    return req.session.listRawMaterials;
}

function setListWorkers(req,producers){
    req.session.producers=producers
}

function getListWorkers(req){
    return req.session.producers;
}

function setListProducts(req, listProducts){
    req.session.listProducts=listProducts
}

function getListProducts(req){
    return req.session.listProducts;
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
        req.session.isWorker = false
        req.session.isCostumer = false
    }
}
function setRole(req, value){
    if(value=="produttore"){
        req.session.isProducer = true
    }
    if(value=="lavoratore"){
        req.session.isWorker = true
    }
    if(value=="cliente"){
        req.session.isCostumer = true
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
    getProfile:getProfile,
    setListProducers:setListProducers,
    getListProducers:getListProducers,
    setListRawMaterial:setListRawMaterial,
    getListRawMaterial:getListRawMaterial,
    setListWorkers:setListWorkers,
    getListWorkers:getListWorkers,
    setListProducts:setListProducts,
    getListProducts:getListProducts
}
