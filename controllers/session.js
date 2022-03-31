function getProfile(req){
    return req.session.user;
}
function setProfile(req,_user){
    session=req.session.user=_user;
}

function setListProducers(req,producers){
    req.session.producers=producers
}

function getListProducers(req){
    return req.session.producers;
}

function setListRawMaterial(req, listRawMaterials){
    req.session.listRawMaterials=listRawMaterials
}

function getListRawMaterial(req){
    return req.session.listRawMaterials;
}

function setListOwnRawMaterial(req, listOwnRawMaterials){
    req.session.listOwnRawMaterials=listOwnRawMaterials
}

function getListOwnRawMaterial(req){
    return req.session.listOwnRawMaterials;
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

function setListOwnProducts(req, listOwnProducts){
    req.session.listOwnProducts=listOwnProducts
}

function setListProductSelection(req, listProductSelection){
    req.session.listProductSelection=listProductSelection
}

function getListProductSelection(req){
    return req.session.listProductSelection;
}


function getListOwnProducts(req){
    return req.session.listOwnProducts;
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
        req.session.isCustomer = false
    }
}
function setRole(req, value){
    if(value=="Producer"){
        req.session.isProducer = true
    }
    if(value=="Worker"){
        req.session.isWorker = true
    }
    if(value=="Customer"){
        req.session.isCustomer = true
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
    setListProductSelection:setListProductSelection,
    getListProductSelection:getListProductSelection,
    setListRawMaterial:setListRawMaterial,
    getListRawMaterial:getListRawMaterial,
    setListOwnRawMaterial:setListOwnRawMaterial,
    getListOwnRawMaterial:getListOwnRawMaterial,
    setListWorkers:setListWorkers,
    getListWorkers:getListWorkers,
    setListProducts:setListProducts,
    getListProducts:getListProducts,
    setListOwnProducts:setListOwnProducts,
    getListOwnProducts:getListOwnProducts
}
