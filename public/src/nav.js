document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");
  //const profile = document.getElementById("profile");
  const login = document.getElementById("login");
  if (token) {
    login.innerHTML = `<div><li class="relative group" onmouseover="showDropdown()">

    <div class="hover:text-gray-400">
        <a href="#" id="profile" class="hover:font-bold"></a><i
            class="fa-solid fa-user text-gray-300 hover:text-white"></i>
        <div id="dropdownContent"
            class="absolute left-1/2 transform -translate-x-1/2 mt-2 z-10 hidden divide-y divide-gray-100 rounded-lg shadow w-44 bg-black text-white"
            onmouseout="hideDropdown()">
            <!-- User Details -->
            <div class="py-2">
                <a href="#"
                    class="block px-4 py-2 text-sm hover:bg-gray-400 dark:hover:bg-black dark:text-gray-200 dark:hover:text-white">
                    Name
                    <br>
                    7494899798
                </a>
            </div>
            <!-- User details Ended -->
            <!-- option -->
            <ul class="py-2 text-sm dark:text-gray-200" aria-labelledby="dropdownDividerButton">
                <li>
                    <a href="./profile.html"
                        class="block px-4 py-2 hover:bg-gray-400 dark:hover:bg-gray-600 dark:hover:text-white">Account</a>
                </li>
            </ul>

            <!-- option ends -->
            <div class="py-2">
                <a href="#"
                    class="block px-4 py-2 text-sm hover:bg-gray-400 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white">Logout</a>
            </div>
        </div>
    </div>
</li></div>`
  }
});
