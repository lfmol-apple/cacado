

import { Service } from 'node-windows';
// Criando um novo objeto do Serviço
var svc = new Service({
//Nome do servico
name:'ocs-api',
//Descricao que vai aparecer no Gerenciamento de serviço do Windows
description: 'Serviço API ocs-gestão',
//caminho absoluto do seu script
script: 'C:\\OCS\\ocs-gestao\\api\\server.js'
});
svc.on('install',function(){
svc.start();
});
// instalando o servico
svc.install()