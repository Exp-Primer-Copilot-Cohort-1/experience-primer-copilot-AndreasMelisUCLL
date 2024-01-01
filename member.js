function skillsMember() {
  var member = document.getElementById("member");
  var memberSkills = document.getElementById("member-skills");
  var memberSkillsBtn = document.getElementById("member-skills-btn");
  var memberSkillsBtnIcon = document.getElementById("member-skills-btn-icon");

  if (memberSkills.style.display == "none") {
    memberSkills.style.display = "block";
    memberSkillsBtn.style.backgroundColor = "#f5f5f5";
    memberSkillsBtnIcon.style.transform = "rotate(180deg)";
    member.style.height = "auto";
  } else {
    memberSkills.style.display = "none";
    memberSkillsBtn.style.backgroundColor = "#fff";
    memberSkillsBtnIcon.style.transform = "rotate(0deg)";
    member.style.height = "auto";
  }
}