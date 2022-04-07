// $(function () {
// 	$(".fold-table tr.view").on("click", function () {
// 		$(this).toggleClass("open").next(".fold").toggleClass("open");
// 	});
// });

// document.querySelector(function () {
document
	.querySelector(".fold-table tr.view")
	.addEventListener("click", function () {
		console.log("uzo");
		document.querySelector(".fold-table tr.fold").classList.toggle("open");
	});
// });
