# Setup folder:
keep api.js, utility.js in same folder
Keep sw.js file in root folder of project directory.

# For HTML:
1. add "utility.js" file
2. add "api.js"
3. in "sw.js" file update "utility.js" url path at utilityUrl variable. Ex: const utilityUrl = '/src/js/utility.js'
4. in "sw.js" at STATIC_FILES variable add your static file url like: index.php, boostrap, js, images.
5. For sync form submission for offline. have to use submitPostData().
Ex:
const url_to_submit = "http://localhost/create_post";
const post_data_as_object = { name: "AM", title: "Software developer" };
submitPostData(url_to_submit, post_data_as_object)

6. For ajax request to get data use fetch()
Ex:
fetch("http://localhost:8080").then((response) => {
	return response.json();
}).then((data) => {
	// here your data
	console.log(data); 
});
you can check js fetch in google
here is fetch documention of MDN: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch

N.B.: Don't need to import sw.js in html

Every time change static file update sw.js VERSION variable
