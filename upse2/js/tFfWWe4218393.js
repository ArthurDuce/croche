
    function atomiApplyParams({inputUrl}) {
      try {
        console.log(inputUrl)
        const inputUrlObj = new URL(inputUrl, window.location.origin);
        const currentPageParams = new URLSearchParams(window.location.search);
        const inputUrlParams = new URLSearchParams(inputUrlObj.search);
      
        // Iterate over all parameters in the current page's URL
        for (const [key, value] of currentPageParams) {
          // If the input URL does not already contain the parameter, add it
          if (!inputUrlParams.has(key)) {
            inputUrlParams.append(key, value);
          }
        }
      
        // Construct the final URL
        const finalUrl = inputUrlObj.origin + inputUrlObj.pathname + '?' + inputUrlParams.toString();
        console.log(finalUrl)
        return finalUrl;
      } catch (error) {
        console.log(error);
      }
    }

    function atomiFormatDate(options = { slated: false, addDate: 0 }) {
      try {
        const defaultOptions = {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        };

        const today = new Date();

        if (options.slated) {
          const slatedDate = new Date(today);
          slatedDate.setDate(slatedDate.getDate() + (options.addDate || 0));

          const day = slatedDate.getDate().toString().padStart(2, "0");
          const month = (slatedDate.getMonth() + 1).toString().padStart(2, "0");
          const year = slatedDate.getFullYear();
          return `${day}/${month}/${year}`;
        }

        if(options.addDate){
          today.setDate(today.getDate()+options.addDate)
        }
        const formattedDate = today.toLocaleDateString(undefined, defaultOptions);

        return formattedDate;
      } catch (error) {
        console.log(error);
      }
    };

    function atomiFormatTime() {
      try {
        const now = new Date();
        return now.toLocaleTimeString(undefined, {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        });
      } catch (error) {
        console.log(error);
      }
    };
    function runDelayedFunctions(data) {
      try {
        document.querySelectorAll('.atomicat-delay').forEach(el => el.classList.remove('atomicat-delay'));
        if(data?.setDisplayed){
          localStorage.setItem(data?.setDisplayed, true);
        }
        
      } catch (error) {
        console.log(error);
      }
    }
  
      (function() {
        try {
          const replaceItems = ["hoje-ext", "amanha-ext", "hoje", "ano", "amanha", "hora"]
          replaceItems.forEach(rI => {
            let innerData = ""
            if(rI == "hoje-ext"){
              innerData = atomiFormatDate()
            } else if(rI == "amanha-ext"){
              innerData = atomiFormatDate({addDate: 1})
            } else if(rI == "hoje"){
              innerData = atomiFormatDate({ slated: true })
            } else if(rI == "ano"){
              innerData = new Date().getFullYear()
            } else if(rI == "amanha"){
              innerData = atomiFormatDate({ slated: true, addDate: 1 })
            } else if(rI == "hora"){
              innerData = atomiFormatTime()
            }
            document.querySelectorAll('.atomicat-'+rI).forEach(el => {
              el.innerText = innerData
            });
          });
        } catch (error) {
          console.log(error);
        }
      })();
    
    (function() {
      try {
        document.addEventListener('DOMContentLoaded', function () {
          document.addEventListener("keydown", function (e) {
            e.ctrlKey && e.preventDefault();
          }),
          (document.onkeydown = function (e) {
            if (123 == e.keyCode) return !1;
          }),
          document.addEventListener("contextmenu", (e) => e.preventDefault());
        });
      } catch (error) {
        console.log(error);
      }
    })();
    
      (function() {
        try {
          var vturbvideoId = "6724eb35933c14000b6d5723";
          var SECONDS_TO_DISPLAY = 152;
          var attempts = 0;
          var elsDisplayed = false;
          var alreadyDisplayedKey = 'alreadyElsDisplayed152';
          var alreadyElsDisplayed = localStorage.getItem(alreadyDisplayedKey);

          var showHiddenElements = function () {
            elsDisplayed = true;
            runDelayedFunctions();
            localStorage.setItem(alreadyDisplayedKey, true);
          };
          if (alreadyElsDisplayed === 'true') {
            setTimeout(function () {
              showHiddenElements();
            }, 100);
          } else {
            startWatchVideoProgress();
          }
          function getVideoInstance() {
            if (smartplayer.instances.length > 1) {
              return smartplayer.instances.find(
                (instance) => instance.options.id === vturbvideoId
              );
            }
            return smartplayer.instances[0];
          };
          function startWatchVideoProgress() {
            if (typeof smartplayer === 'undefined' || !(smartplayer.instances && smartplayer.instances.length)) {
              if (attempts >= 10) return;
              attempts += 1;
              return setTimeout(function () {
                startWatchVideoProgress();
              }, 1000);
            }
            console.log(smartplayer.instances);
            var videoInstance = getVideoInstance();
            videoInstance.on('timeupdate', () => {
              if (elsDisplayed || videoInstance.smartAutoPlay) return;
              console.log("currentTime => " +videoInstance.video.currentTime +" SECONDS_TO_DISPLAY => " +SECONDS_TO_DISPLAY);
              if (videoInstance.video.currentTime < SECONDS_TO_DISPLAY) return;
              showHiddenElements();
            });
          };
        } catch (error) {
          console.log(error);
        }
      })();
    