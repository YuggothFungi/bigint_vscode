var LNList=[];

function push_long_list(rand=true){
	let new_int = new TLNum({'digits':[26,0,1,4,23,7,0]});
	let n_id = `span_id_${LNList.length}`;
	let generated_html=`<span id="${n_id}" class="ln_container">${new_int.str()} [${new_int.digits().join(", ")}]</span>`;
	$("#num_list").append($(generated_html));
	new_int.layout=$(`#${n_id}`);
	if(rand){new_int.setRand()}
	else {}
	LNList.push(new_int);
}

function my_first_function(e){
	console.log(arguments);
	console.log(event.target);
}

var hideme = function(e){
	$(e.target).hide();
}

function rndClickHander(clickEvent){
	var buffer = new TBuffer(23,135);
	console.log(buffer.writeNumberInBaseArray(0));
}

$(document).ready(function(){
	$("#newLInt").on('click', () => {push_long_list(false)})
	$("#rndLInt").on('click', () => {push_long_list})
});