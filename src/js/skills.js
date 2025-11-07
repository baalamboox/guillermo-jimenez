const gjSkillsNavList = document?.querySelector("#gjSkillsNavList");

gjSkillsNavList.addEventListener("click", (event) => {
    gjSkillsNavList.children.map(element => {
       console.log(element); 
    });
    event.target.classList.add("gj:skills:nav-button-active");
});
