const searchQuery = document.querySelector("#searchInput");
const searchButton = document.querySelector("#searchButton");
const profileInfoDiv = document.querySelector("#profile-info");
const reposInfoDiv = document.querySelector("#repos-info");
const loader = document.querySelector("#loader");
const sortOptions = document.querySelector("#sortOptions");
const searchInput = document.querySelector("[data-search]");
const searchDiv = document.querySelector("#search");

window.addEventListener("DOMContentLoaded", async () => {
  try {
    loader.classList.remove("hidden");
    const response = await fetch("https://api.github.com/users/sujitmemane");
    const data = await response.json();
    showProfileInfo(data);
  } catch (error) {
    console.error(error);
    alert("An error occurred while fetching data from the server.");
  } finally {
    loader.classList.add("hidden");
  }
});

searchButton.addEventListener("click", async () => {
  if (searchQuery.value.length > 0) {
    const username = searchQuery.value.trim();
    try {
      loader.classList.remove("hidden");

      const response = await fetch(`https://api.github.com/users/${username}`);
      const data = await response.json();
      showProfileInfo(data);
      showReposInfo(username);
    } catch (error) {
      console.error(error);
      alert("An error occurred while fetching data from the server.");
    } finally {
      loader.classList.add("hidden");
    }

    searchQuery.value = "";
  }
});

const showReposInfo = async (username) => {
  try {
    loader.classList.remove("hidden");
    searchDiv.classList.remove("hidden");
    const response = await fetch(
      `https://api.github.com/users/${username}/repos`
    );
    const projects = await response.json();
    let sortedRepos = [...projects];
    const renderRepos = () => {
      reposInfoDiv.innerHTML = "";
      for (let i = 0; i < sortedRepos.length; i++) {
        reposInfoDiv.innerHTML += `
          <div class='max-w-[300px] border flex flex-col items-center justify-between p-8 cursor-pointer hover:shadow-lg' id='pro-${i}'>
            <img src='images/a.png' class='w-48 h-48' />
            <h1 class='text-sm capitalize font-bold text-center'>${sortedRepos[
              i
            ].name.replace(/[_-]/g, " ")}</h1>
            <a href=${
              sortedRepos[i].html_url
            } target='_blank' class="px-8 py-3 mt-12 my-4 bg-[#212529] rounded text-white font-bold uppercase">Checkout Project</a>
          </div>
        `;
      }
    };

    sortOptions.addEventListener("change", () => {
      const value = sortOptions.value;
      if (value === "stars") {
        sortedRepos.sort((a, b) => b.stargazers_count - a.stargazers_count);
      } else if (value === "forks") {
        sortedRepos.sort((a, b) => b.forks - a.forks);
      } else if (value === "size") {
        sortedRepos.sort((a, b) => b.size - a.size);
      } else {
        sortedRepos = [...projects];
      }
      renderRepos();
    });
    searchInput.addEventListener("input", (e) => {
      const value = e.target.value;

      sortedRepos.forEach((pro, index) => {
        const isVisible = pro.name.toLowerCase().includes(value);
        const proBox = document.querySelector(`#pro-${index}`);
        proBox.classList.toggle("hidden", !isVisible);
      });
    });

    renderRepos();
  } catch (error) {
    console.error(error);
    alert("An error occurred while fetching data from the server.");
  } finally {
    loader.classList.add("hidden");
  }
};

const showProfileInfo = async (data) => {
  profileInfoDiv.innerHTML = `
    <div class='flex flex-col  md:flex-row items-center justify-between p-8'>
     <div class='flex flex-col space-y-4 md:w-1/2  items-center'>
     <img src= ${data.avatar_url} class='w-92 md:w-auto h-auto'  loading='lazy' />
     <h1 class='font-bold text-2xl font-bold  uppercase'>${data.name}</h1>
     
     </div>

     <div class='flex flex-col space-y-4 md:w-1/2  items-center justify-between p-4 md:p-8'>
     <h2 class='text-center text-xl  max-w-sm '>${data.bio}</h2>
     <div class = 'flex flex-row items-center justify-center space-x-4' >
     
     <button  class="md:px-12 px-8 py-3 bg-[#212529]  test-xs text-white font-bold uppercase rounded  ">
     ${data.followers} Followers
     </button>
    <button  class="md:px-12 px-8 py-3 bg-[#212529] text-white font-bold uppercase  rounded  ">
     ${data.following} Following
     </button>
     </div>

     <div class='flex flex-col space-y-4'>
    <a href='https://twitter.com/${data.twitter_username} ' target='_blank' class="px-12 py-3 rounded bg-[#219ebc] text-white font-bold uppercase    ">
     Connect on Twitter
     </a>
     <a href=${data.html_url} target='_blank' class="px-12 py-3  mt-12  my-4 bg-[#212529] rounded  text-white font-bold uppercase    ">
     Checkout  Profile
     </a>
     </div>
  
     <div >
     <h2 class='text-xl font-bold uppercase'>Total REPOSITORIES : ${data.public_repos}</h2>
     </div>
       
     </div>
  
    </div>
    
   `;
};
