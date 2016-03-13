var app = angular.module("gptexteditor", ["ngSanitize", "ngclipboard", "ngCookies", "colorpicker.module"]);


app.filter("keepHTML", function()
{
	
});
//redoing for chrome i think
// app.directive('ngRightClick', function($parse) {
//     return function(scope, element, attrs) {
//         var fn = $parse(attrs.ngRightClick);
//         element.bind('contextmenu', function(event) {
//             scope.$apply(function() {
//                 event.preventDefault();
//                 fn(scope, {$event:event});
//             });
//         });
//     };
// });

// app.directive('sglclick', ['$parse', function($parse) {
//     return {
//         restrict: 'A',
//         link: function(scope, element, attr) {
//           var fn = $parse(attr['sglclick']);
//           var delay = 250, clicks = 0, timer = null;
//           element.on('click', function (event) {
//             clicks++;  //count clicks
//             if(clicks === 1) {
//               timer = setTimeout(function() {
//                 scope.$apply(function () {
//                     fn(scope, { $event: event });
//                 }); 
//                 clicks = 0;             //after action performed, reset counter
//               }, delay);
//               } else {
//                 clearTimeout(timer);    //prevent single-click action
//                 clicks = 0;             //after action performed, reset counter
//               }
//           });
//         }
//     };
// }])




app.controller("MainCtrl",
	function($scope, $cookies)
	{
	
		$scope.addColor = "blue";
		$scope.remColor = "red";
		$scope.comColor = "green";
		$scope.limit = 200;

		$scope.amAdd = "#0000ff";
		$scope.amRem = "#ff0000";

		function regexEscape(str) {
		    return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
		}

		$scope.go = function()
		{
			
			$scope.m.dispArr = $scope.thingToGP.replace(/\n/g, " <br> ").split(" ");

			var closingTag = false;

			var i = 0;

			// var checkAddCol = regexEscape("[COLOR=") + $scope.amAdd + regexEscape("]");
			// var checkRemCol = regexEscape("[COLOR=") + $scope.amRem + regexEscape("]");

			// var checkAddCol = "\[COLOR=" + $scope.amAdd + "]";
			// var checkRemCol = "\[COLOR=" + $scope.amRem + "]";

			var checkAddCol = $scope.amAdd;
			var checkRemCol = $scope.amRem;

			while (i < $scope.m.dispArr.length)
			{
				var currentWord = $scope.m.dispArr[i];

				if (currentWord.indexOf(checkAddCol) > -1)
				{
					var j = 0; //calcing when closing tag ends
					while(!closingTag)
					{
						
						
						if ($scope.m.dispArr[i + j].indexOf("[/COLOR]") > -1)
						{
							closingTag = true;
						}

						j++;
					}

					for (var k = 0; k < j; k++)
					{
						var wordToStyle = $scope.m.dispArr[i + k];

						var regex = new RegExp(checkAddCol, "g");

						$scope.m.dispArr[i + k] = $scope.m.dispArr[i + k].replace(regex, "");
						$scope.m.dispArr[i + k] = $scope.m.dispArr[i + k].replace(/\[COLOR=]/g, "");
						$scope.m.dispArr[i + k] = $scope.m.dispArr[i + k].replace(/\[\/COLOR]/g, "");//.replace(/\[]/g, "").replace(/\[\/]/g, "");
						$scope.m.dispArr[i + k] = '<strong class="AddMaster">' + $scope.m.dispArr[i + k] + "</strong>";
					}
					i = i + j;
					closingTag = false;
				}

				else if (currentWord.indexOf(checkRemCol) > -1)
				{
					var j = 0; //calcing when closing tag ends
					while(!closingTag)
					{
						
						
						if ($scope.m.dispArr[i + j].indexOf("[/COLOR]") > -1)
						{
							closingTag = true;
						}

						j++;
					}

					for (var k = 0; k < j; k++)
					{
						var wordToStyle = $scope.m.dispArr[i + k];

						var regex = new RegExp(checkRemCol, "g");

						$scope.m.dispArr[i + k] = $scope.m.dispArr[i + k].replace(regex, "");
						$scope.m.dispArr[i + k] = $scope.m.dispArr[i + k].replace(/\[COLOR=]/g, "");
						$scope.m.dispArr[i + k] = $scope.m.dispArr[i + k].replace(/\[\/COLOR]/g, "");//.replace(/\[]/g, "").replace(/\[\/]/g, "");
					
						$scope.m.dispArr[i + k] = '<del><strong class="RemoveMaster">' + $scope.m.dispArr[i + k] + "</strong></del>";
				
					}
					i = i + j;
					closingTag = false;
				}

				// $scope.m.dispArr[i] = $scope.m.dispArr[i].replace(/\[COLOR=blue]/g, '<span class="AddMaster">');
				// $scope.m.dispArr[i] = $scope.m.dispArr[i].replace(/\[COLOR=red]/g, '<span class="RemoveMaster">');
				// $scope.m.dispArr[i] = $scope.m.dispArr[i].replace(/\[COLOR=#0000ff]/g, '<span class="AddMaster">');
				// $scope.m.dispArr[i] = $scope.m.dispArr[i].replace(/\[COLOR=#ff0000]/g, '<span class="RemoveMaster">');

				// $scope.m.dispArr[i] = $scope.m.dispArr[i].replace(/\[\/COLOR]/g, "</span>");

				// $scope.m.dispArr[i] = $scope.m.dispArr[i].replace(/\[B]/g, "<strong>")
				// $scope.m.dispArr[i] = $scope.m.dispArr[i].replace(/\[\/B]/g, "</strong>")
				else
				{
					closingTag = false;
					i++;
				}
				
			}
			
			
			
			


			$scope.m.cpArr = $scope.thingToGP.replace(/\n/g, " <br> ").split(" ");
			$scope.cpthis = "";
		}

		$scope.checked = 
		{
			val : true,
			smog : false
		}


		$scope.copyToBoard = function()
		{
			//alert("add " + $scope.addColor + " remove " + $scope.remColor);

			var colorToAdd = "[COLOR=" + $scope.addColor + "]";
			var colorToRem = "[COLOR=" + $scope.remColor + "]";
			var colorToCom = "[COLOR=" + $scope.comColor + "]";

			var amAdd = "[COLOR=" + $scope.amAdd + "]";
			var amRem = "[COLOR=" + $scope.amRem + "]";

			$scope.cpthis = $scope.m.cpArr.join(" ").replace(/\[\/S]\[\/COLOR]\[\/B] \[B]\[COLOR=red]\[S]/g, " ").replace(/\[B]\[COLOR=red]\[\/COLOR]\[\/B]/g, "").replace(/\[\/B]\[\/COLOR] \[COLOR=blue]\[B]/g, " ");
			$scope.cpthis = $scope.cpthis.replace(/\[COLOR=red]/g, colorToRem);
			$scope.cpthis = $scope.cpthis.replace(/\[COLOR=blue]/g, colorToAdd);

			$scope.cpthis = $scope.cpthis.replace(/\[c](.*?)\[\/c]/g, colorToCom + "(Comment: $1)[/COLOR]");

			$scope.cpthis = "[COLOR=" + $scope.addColor + "][B]add[/B][/COLOR] " + "[COLOR=" + $scope.remColor + "][B][S]remove[/S][/B][/COLOR] " + "[COLOR=" + $scope.comColor + "][B]comments[/B][/COLOR] \n" + "[hide]" + $scope.cpthis + "[/hide]";
			
			$scope.cpthis = $scope.cpthis.replace(/ \<br\> /g, "\n");
			
			if ($scope.checked.val)
			{
				$scope.cpthis = $scope.cpthis.replace(/U-Turn/g, colorToRem + "[B][S]U-Turn[/S][/B][/COLOR] " + colorToAdd + "[B]U-turn[/B][/COLOR]");
				$scope.cpthis = $scope.cpthis.replace(/V-Create/g, colorToRem + "[B][S]V-Create[/S][/B][/COLOR] " + colorToAdd + "[B]V-create[/B][/COLOR]");
				$scope.cpthis = $scope.cpthis.replace(/Ho-oh/g, colorToRem + "[B][S]Ho-oh[/S][/B][/COLOR] " + colorToAdd + "[B]Ho-Oh[/B][/COLOR]");
				$scope.cpthis = $scope.cpthis.replace(/ThunderPunch/g, colorToRem + "[B][S]ThunderPunch[/S][/B][/COLOR] " + colorToAdd + "[B]Thunder Punch[/B][/COLOR]");

			}

			if ($scope.checked.smog)
			{
				$scope.cpthis = $scope.cpthis.replace(/Pokemon/g, colorToRem + "[B][S]Pokemon[/S][/B][/COLOR] " + colorToAdd + "[B]Pok&eacute;mon[/B][/COLOR]");

			}
		}

		$scope.increaseLimit = function()
		{
			$scope.limit += 200;
		}


		var firstInd = 0;
		var secondInd = 0;
		var shiftCount = 0;

		$scope.resetShift = function()
		{
			shiftCount = 0;

		}


function setSelectionRange(input, selectionStart, selectionEnd) {
  if (input.setSelectionRange) {
    input.focus();
    input.setSelectionRange(selectionStart, selectionEnd);
  }
  else if (input.createTextRange) {
    var range = input.createTextRange();
    range.collapse(true);
    range.moveEnd('character', selectionEnd);
    range.moveStart('character', selectionStart);
    range.select();
  }
}

function setCaretToPos (input, pos) {
  setSelectionRange(input, pos, pos);
}
	

		$scope.addComTag = function(index)
		{
			var comment2add = $("#wordToAdd" + index).val();
			//$("#wordToAdd" + index).focus();
			$("#wordToAdd" + index).val(comment2add + "[c]  [/c]");
			setCaretToPos($("#wordToAdd" + index)[0], comment2add.length + 4);
			//alert(comment2add);

		}

		$scope.addmdash = function(index)
		{
			var currentText = $("#wordToAdd" + index).val();
			$("#wordToAdd" + index).val(currentText + "&mdash;");
			setCaretToPos($("#wordToAdd" + index)[0], currentText.length + 7);
		}

		$scope.addAccE = function(index)
		{
			var currentText = $("#wordToAdd" + index).val();
			$("#wordToAdd" + index).val(currentText + "Pok&eacute;mon");
			setCaretToPos($("#wordToAdd" + index)[0], currentText.length + 14);
		}


		$scope.edit = function(event, index)
		{	

			if (event.shiftKey)
			{

				shiftCount++;
				if (shiftCount === 1)
				{
					firstInd = index;
				}
				if (shiftCount === 2)
				{
					secondInd = index;
				}

				if (secondInd > 0)
				{
					for (var i = Math.min(firstInd, secondInd); i < Math.max(firstInd, secondInd) + 1; i++)
					{
						$scope.m.dispArr[i] = '<del><strong class="redRemove">' + $scope.m.dispArr[i] + '</strong></del>';
						if (!($scope.m.cpArr[i].indexOf('[B][COLOR=red][S]') > -1))
						{
							$scope.m.cpArr[i] = '[B][COLOR=red][S]' + $scope.m.cpArr[i] + '[/S][/COLOR][/B]';
						}
					}
					shiftCount = 0;
					firstInd = 0;
					secondInd = 0;
				}

				$scope.testing = index + " " + shiftCount;
			}
			if (event.ctrlKey && !event.altKey)
			{
					
				{
					if ($scope.m.dispArr[index].indexOf('<del><strong class="redRemove">') > -1)
					{
						$scope.m.dispArr[index] = $scope.m.dispArr[index].substring(31);
						$scope.m.dispArr[index] = $scope.m.dispArr[index].substring(0, $scope.m.dispArr[index].length - 15);
						
					}

					if ($scope.m.cpArr[index].indexOf('[B][COLOR=red][S]') > -1)
					{
						$scope.m.cpArr[index] = $scope.m.cpArr[index].substring(17);
						$scope.m.cpArr[index] = $scope.m.cpArr[index].substring(0, $scope.m.cpArr[index].length - 16);
					}

					if ($scope.m.cpArr[index].indexOf('[COLOR=blue][B]') > -1)
					{
						$scope.m.cpArr.splice(index, 1);
						$scope.m.dispArr.splice(index, 1);
					
						$scope["style" + (index)] = {'color' : 'none', 'font-weight' : 'none'};
						$scope["style" + (index-1)] = {'color' : 'none', 'font-weight' : 'none'};

						// $scope.m.cpArr[index] = $scope.m.cpArr[index].substring(16);
						// $scope.m.cpArr[index] = $scope.m.cpArr[index].substring(0, $scope.m.cpArr[index].length - 12);
					}


				}
			}
			if (event.altKey)
			{
				$scope["addingWord" + index] = true;
				
				
			}
			else if (!event.ctrlKey && !event.altKey && !event.shiftKey)
			{


		
				$scope.m.dispArr[index] = '<del><strong class="redRemove">' + $scope.m.dispArr[index] + '</strong></del>';
				//only need to check the beginning because removing will remove both sides
				if (!($scope.m.cpArr[index].indexOf('[B][COLOR=red][S]') > -1))
				{
					$scope.m.cpArr[index] = '[B][COLOR=red][S]' + $scope.m.cpArr[index] + '[/S][/COLOR][/B]';
				}
			}
		}

		$scope.focusInput = function(event, index)
		{

			// if (event.altKey)
			// {
				$("#wordToAdd" + index).focus();
			// }
		}

		$scope.showAddWord = function(event, index)
		{
			
			$scope["addingWord" + index] = true;
			
			//$scope["addingWord" + index] = false;
		}



		$scope.addWord = function(event, index)
		{
			
			var word2add = $("#wordToAdd" + index).val();
			var arr2add = word2add.split(" ");



			if (event.keyCode === 13)
			{
				//$scope.m.dispArr.splice(index + 1, 0, arr2add);
				
				for (var i = index; i < index + arr2add.length; i++)
				{
					
					$scope.m.dispArr.splice(i + 1, 0, arr2add[i-index]);
					$scope.m.dispArr[i + 1] = '<strong class="blueAdd">' + $scope.m.dispArr[i + 1] + "</strong>";
					//$scope["style" + (i+1)] = {'color' : 'blue', 'font-weight' : 'bold'};
					$scope.m.cpArr.splice(i + 1, 0, '[COLOR=blue][B]' + arr2add[i-index] + '[/B][/COLOR]');

				}

				//alert($scope.m.cpArr);
				$scope["addingWord" + index] = false;

			}
		}

		$scope.test = function()
		{
			alert($scope.m.toSource());
		}

		$scope.test2 = function(event)
		{
			alert(event.target.toSource());
		}

		$scope.test3 = function()
		{
			alert("2x click");
		}






	});

