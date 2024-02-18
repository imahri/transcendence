export function showPassword() {
    let svg = document.getElementById("eyeIcon");
    let path = svg.querySelector("path");
    var PasswordInput = document.getElementById("password");
    PasswordInput.type = PasswordInput.type == "text" ? "password" : "text";
    let color = PasswordInput.type == "text" ? "#00B6FF" : "#8C8C8C";
    path.setAttribute("fill", color);
  }

export function errorInForm(setErrorInput, setError) {
    //I change the state to true to re-render the componnents and disply the eroor section
    setErrorInput(true);
    setError(true);
    setTimeout(() => {
      //here i try to display error msg but only for 5s
      setErrorInput(false);
      setError(false);
    }, 5000);
  }

export  async function postRequest(url, requestBody){

    const response = await fetch(url, 
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });
    return response;
  }