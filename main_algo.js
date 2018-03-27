function main_algo(cost_matrix, N){

	var final_path = [];
	var verify = document.getElementById("info_verify");
	var text = "";
	var temp = ++N;
	N--;
	for(var i = 1; i < temp;i++ ){

		for(var j = 1 ; j < temp; j++){

			text = text + cost_matrix[i][j] + " ";
			
		}




	}//end of for loops
	verify.innerHTML = text;
}


function firstMin(cost_matrix, i)
{
    var min = 100000;
    for (int k=0; k<N; k++)
        if (cost_matrix[i][k]<min && i != k)
            min = cost_matrix[i][k];
    return min;
}
