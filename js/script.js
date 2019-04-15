window.addEventListener('load', carregado());

var bd;
var estado = -1;

function carregado(){
		
	bd = openDatabase('mydb', '1.0', 'Meu banco', 2048*1024);

	if(!bd){
		alert('Deu pau no banco!!');
	} else {
		bd.transaction(function(tx){
		tx.executeSql('CREATE TABLE cliente ( ' +
			'cd       INTEGER PRIMARY KEY, ' +
			'nm       TEXT NOT NULL,    ' +
			'endereco TEXT NOT NULL,    ' +
			'rg       TEXT NOT NULL,    ' +
			'cpf      TEXT NOT NULL,    ' +
			'CEP      TEXT NOT NULL,    ' +
			'cidade   TEXT NOT NULL,    ' +
			'telefone TEXT NOT NULL,    ' +
			'email    TEXT NOT NULL)', null,
			function(transaction, error){
	            alert('deu pau!');
	            console.log(error);
        	});
		});
		listar(document.getElementById('tx-pesq').value);
	}
	
}

function inserir(){
	var nm = document.getElementById("nm");
	var rg = document.getElementById("rg");
	var cpf = document.getElementById("cpf");
	var CEP = document.getElementById("CEP");
	var cidade = document.getElementById("cidade");
	var telefone = document.getElementById("telefone");
	var email = document.getElementById("email");
	var endereco = document.getElementById("endereco");

	if (nm.value == "") {
		nm.classList.add("invalid");
		return;
	}
	if (rg.value == "") {
		rg.classList.add("invalid");
		return;
	}
	if (cpf.value == "") {
		cpf.classList.add("invalid");
		return;
	}
	if (CEP.value == "") {
		CEP.classList.add("invalid");
		return;
	}
	if (cidade.value == "") {
		cidade.classList.add("invalid");
		return;
	}
	if (telefone.value == "") {
		telefone.classList.add("invalid");
		return;
	}
	if (email.value == "") {
		email.classList.add("invalid");
		return;
	}
	if (endereco.value == "") {
		endereco.classList.add("invalid");
		return;
	}

	if (estado == -1){
		bd.transaction(function(tx){
			tx.executeSql("INSERT INTO cliente(nm, rg, cpf, CEP, endereco, cidade, telefone, email) VALUES " +
				"(?, ?, ?, ?, ?, ?, ?, ?)", [nm.value, rg.value, cpf.value, CEP.value,
											 endereco.value, cidade.value, telefone.value, email.value],
				function(transaction){
		            alert('Inserido com sucesso')
		            document.getElementById('form-cliente').reset();
	        	}, 
				function(transaction, error){
		            alert('deu pau!');
		            console.log(error);
	        	});
		});
	} else {
		let cd = "" + estado;

		bd.transaction(function(tx){
			tx.executeSql("UPDATE cliente SET " +
				" nm        = ?, " +
				" rg        = ?, " +
				" cpf       = ?, " +
				" endereco  = ?, " +
				" CEP       = ?, " +					    
				" cidade    = ?, " +
				" telefone  = ?, " +
				" email     = ?  " +
				" WHERE cd  = ? ",
				
				[nm.value, rg.value, cpf.value, endereco.value, 
				 CEP.value, cidade.value, telefone.value, email.value, cd],

				function(transaction){
		            alert('Alterado com sucesso')
		            document.getElementById('form-cliente').reset();
	        	}, 

				function(transaction, error){
		            alert('deu pau!');
		            console.log(error);
	        	});
		});
	}
	estado = -1;

	document.getElementById("salvar").innerHTML = "Inserir";
	document.getElementById("limpar").classList.remove("disabled");
	listar(document.getElementById('tx-pesq').value);
}

function listar(str){
	var s = str
	bd.transaction(function(tx){
		console.log(s);
		tx.executeSql('SELECT cd, nm, rg, cpf, CEP, cidade, telefone, email, endereco FROM cliente WHERE nm like "' + str + '%"', [], 
			function(tx, resultado){
				var row = resultado.rows;
				var tr = "";
				for (var i = 0;i < row.length; i++){
					tr += '<tr onClick = "atualizar(' + row[i].cd + ')" >' +
						  '<td>' + row[i].cd + '</td>' +
						  '<td>' + row[i].nm       + '</td>' +
						  '<td>' + row[i].rg       + '</td>' +
						  '<td>' + row[i].cpf      + '</td>' +
						  '<td>' + row[i].CEP      + '</td>' +
						  '<td>' + row[i].cidade   + '</td>' +
						  '<td>' + row[i].telefone + '</td>' +
						  '<td>' + row[i].email    + '</td>' +
						  '<td>' + row[i].endereco + '</td>' +
						  '</tr>'
				}
				document.getElementById('table-content').innerHTML = 				
				 
				'<tr>' +
					'<th>Cód      </th>' +
					'<th>Nome     </th>' +
					'<th>RG       </th>' +
					'<th>CPF      </th>' +
					'<th>CEP      </th>' +
					'<th>Cidade   </th>' +
					'<th>Telefone </th>' +
					'<th>E-mail   </th>' +
					'<th>Endereco </th>' +
				'</tr> ' + tr;
			}, 
			function(transaction, error){
	            console.log('deu pau!');
	            console.log(error);
        	}
        );
	});
}

function atualizar(cd){

	estado = cd;
	document.getElementById("salvar").innerHTML = "Salvar";
	document.getElementById("limpar").classList.add("disabled");

	bd.transaction(function(tx){
		tx.executeSql('SELECT cd, nm, rg, cpf, CEP, cidade, telefone, email, endereco FROM cliente WHERE cd = ?', [cd], 
			function(tx, resultado){

				document.getElementById("nm").value       = resultado.rows[0].nm;
				document.getElementById("rg").value       = resultado.rows[0].rg;
				document.getElementById("cpf").value      = resultado.rows[0].cpf;
				document.getElementById("CEP").value      = resultado.rows[0].CEP;
				document.getElementById("cidade").value   = resultado.rows[0].cidade;
				document.getElementById("telefone").value = resultado.rows[0].telefone;
				document.getElementById("email").value    = resultado.rows[0].email;
				document.getElementById("endereco").value = resultado.rows[0].endereco;
				document.getElementById("nm").classList.add         ("valid");
				document.getElementById("rg").classList.add         ("valid");
				document.getElementById("cpf").classList.add        ("valid");
				document.getElementById("CEP").classList.add        ("valid");
				document.getElementById("cidade").classList.add     ("valid");
				document.getElementById("telefone").classList.add   ("valid");
				document.getElementById("email").classList.add      ("valid");
				document.getElementById("endereco").classList.add   ("valid");
				document.getElementById("lblnm").classList.add      ("active");
				document.getElementById("lblrg").classList.add      ("active");
				document.getElementById("lblcpf").classList.add     ("active");
				document.getElementById("lblCEP").classList.add     ("active");
				document.getElementById("lblcidade").classList.add  ("active");
				document.getElementById("lbltelefone").classList.add("active");
				document.getElementById("lblemail").classList.add   ("active");
				document.getElementById("lblendereco").classList.add("active");

			}, 
			function(transaction, error){
	            console.log('deu pau!');
	            console.log(error);
        	});
	});
}

function cancelar(){
	estado = -1;
	document.getElementById('form-cliente').reset();
	document.getElementById("salvar").innerHTML = "Inserir";
	document.getElementById("limpar").classList.remove("disabled");
}