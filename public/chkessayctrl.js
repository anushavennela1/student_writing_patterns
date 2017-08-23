app.controller('ctrl6',function($scope,$http)
{
               
                 var name=$scope.name;
				 console.log('checkessay controler :',name);
                  var res = {
							method : 'POST',
							url : 'http://localhost:8081/checkNegetive',

							headers: {
							  'Content-Type': 'Application/json'
							},
							data:
							{
							  text: name,
							}
						}
				  $http(res).then(function(response)
				  {
			      
				  console.log('checknegetive2 response :',JSON.stringify(response.data));
				  $scope.names = response.data;
                     //console.log(JSON.stringify($scope.names.concepts[0].text));
                  })
               
})