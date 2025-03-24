
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
        const userLocale = navigator.language || 'en-US';
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

          const formatter = new Intl.DateTimeFormat(userLocale, {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          });

          return formatter.format(slatedDate);

          // const day = slatedDate.getDate().toString().padStart(2, "0");
          // const month = (slatedDate.getMonth() + 1).toString().padStart(2, "0");
          // const year = slatedDate.getFullYear();
          // return `${day}/${month}/${year}`;
        }

        if(options.addDate){
          today.setDate(today.getDate()+options.addDate)
        }
        const formattedDate = today.toLocaleDateString(userLocale, defaultOptions);

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
        const accordionTitles = document.querySelectorAll(".atomicat-accordion-title");
        accordionTitles.forEach((title, index) => {
          title.addEventListener("click", () => {
            title.classList.toggle("atomicat-title-active");
            const accordionContent = title.nextElementSibling;
            const toggleSymbol = title.querySelector(".atomicat-accordion-toggle");
            title.childNodes[1].childNodes[0].classList.toggle('atomicat-hidden')
            title.childNodes[1].childNodes[1].classList.toggle('atomicat-hidden')
            accordionContent.classList.toggle("atomicat-content-inactive");
            accordionContent.nextElementSibling.classList.toggle("atomicat-hidden");
          });
        });
      } catch (error) {
        console.log(error);
      }
    })();(function() {
          try {
              const clickeventList = [{"compKey":"a6184430-49ae-4279-91e2-510dbc7d6b2b","misc":{"type":"button"}},{"compKey":"c609e6e0-c0d6-430c-99cb-029cd76bcce1","misc":{"type":"button"}}];
    
    
              clickeventList.forEach((comp, index) => {
                  const compKey = comp?.compKey?.slice(0, 7);
                  const eleType = comp?.misc?.type;
                  const showItemsById = comp?.misc?.showItemsById || comp?.misc?.showItemsByClass;
                  const hideAfterClick = comp?.misc?.hideAfterClick;
                  const hideOnComplete = comp?.misc?.hideOnComplete;
                  if(hideAfterClick) {
                    const hideAfterClickEle = document.querySelector(`.atomicat-hide-after-click-${compKey}`);
                    console.log(hideAfterClickEle, "hideAfterClickEle")
                    if (hideAfterClickEle) {
                      hideAfterClickEle.addEventListener("click", function() {
                          console.log("hideAfterClickEle clicked")
                          hideAfterClickEle.classList.add("atomicat-hidden");
                      })
                    }
                  }
                  if(hideOnComplete) {
                    const hideOnCompleteEle = document.querySelector(`.atomicat-hide-on-complete-${compKey}`);
                    console.log(hideOnCompleteEle, "hideOnCompleteEle")
                    if (hideOnCompleteEle) {
                      hideOnCompleteEle.addEventListener("animationend", function() {
                          console.log("hideOnCompleteEle animationend")
                          hideOnCompleteEle.classList.add("atomicat-hidden");
                      })
                    }
                  }
                  if(showItemsById) {
                    const showItemsByIdEle = document.querySelector(`.atomicat-show-hidden-item-${compKey}`);
                    if(eleType === "progressbar"){
                      showItemsByIdEle.addEventListener("animationend", function() {
                        atomiShowItems()
                      })
                    } else{
                      showItemsByIdEle.addEventListener("click", function() {
                        atomiShowItems()
                      })
                    }
                    function atomiShowItems() {
                      showItemsById.forEach((item) => {
                        const hiddenItem = document.querySelector(`#${item}`) || document.querySelector(`.${item}`);
                        if (hiddenItem) {
                          hiddenItem.classList.remove("atomicat-delay");
                        }
                      })
                    }
                  }
              });
    
          } catch (error) {
              console.log(error);
          }
      })();
      (function() {
        try {
          setTimeout(() => {
            let elementsWithDelayClass = document.querySelectorAll(".atomicat-delay");
            if(elementsWithDelayClass){
              elementsWithDelayClass.forEach(element => {
                element.classList.remove("atomicat-delay");
              });
            }
            
          }, 13000);
        } catch (error) {
          console.log(error);
        }
      })();
    
      
    function atomiLoadSwiperCDN() {
      return new Promise((resolve, reject) => {
        if (!window.Swiper) {
          // Add CSS
          const cssLink = document.createElement('link');
          cssLink.rel = 'stylesheet';
          cssLink.href = 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css';
          cssLink.onload = () => console.log('Swiper CSS loaded');
          document.head.appendChild(cssLink);

          // Add JS
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js';
          script.onload = () => {
            console.log('Swiper JS loaded');
            resolve();
          };
          script.onerror = () => reject(new Error('Failed to load Swiper JS'));
          document.head.appendChild(script);
        } else {
          resolve();
        }
      });
    }
  
      
      (function() {
        try {
          const atomi_slider0d42680_ele = document.querySelector(".atomicat-slider-0d42680")
          const atomi_slider0d42680_observer = new IntersectionObserver(async (entries) => {
            entries.forEach(async (entry) => {
              console.log(entry)
              if (entry.isIntersecting) {
                try {
                  if(!document.querySelector(".swiper-0d42680").classList.contains("swiper-initialized")){
                    console.log("load swiper 0d42680")
                    await atomiLoadSwiperCDN();
                    
      try {
        if (!window.swipers) {
          window.swipers = {};
        }
        if (window.swipers['0d42680']) {
          window.swipers['0d42680'].destroy(true, true);
        }
        window.swipers['0d42680'] = new Swiper('.swiper-0d42680', {
          loop: true,
          autoplay: false,
          speed: 3600,
          spaceBetween: 10,
          direction: 'horizontal',
          navigation: {
            nextEl: '.swiper-0d42680 .swiper-button-next',
            prevEl: '.swiper-0d42680 .swiper-button-prev',
          },
          pagination: {
            el: '.swiper-0d42680 .swiper-pagination',
            clickable: true,
          },
          slidesPerView: 3,
          slidesPerGroup: 1,
          breakpoints: {
            300: {
              slidesPerView: 1,
              slidesPerGroup: 1,
              spaceBetween: 10,
            },
            640: {
              slidesPerView: 2,
              slidesPerGroup: 1,
              spaceBetween: 10,
            },
            1024: {
              slidesPerView: 3,
              slidesPerGroup: 1,
              spaceBetween: 10,
            },
          },
        });
      } catch (error) {
        console.log("swiper init error....");
        console.log(error);
      }
    
                    document.querySelector(".swiper-0d42680").classList.remove("atomicat-hidden")
                  }
                } catch (error) {
                  console.error('Error initializing Swiper:', error);
                }
                atomi_slider0d42680_observer.disconnect(); // Stop observing after initialization
              }
            });
          });

          atomi_slider0d42680_observer.observe(atomi_slider0d42680_ele);
        } catch (error) {
          console.log(error);
        }
      })();
      

      (function() {
        try {
          const atomi_slider9a2794c_ele = document.querySelector(".atomicat-slider-9a2794c")
          const atomi_slider9a2794c_observer = new IntersectionObserver(async (entries) => {
            entries.forEach(async (entry) => {
              console.log(entry)
              if (entry.isIntersecting) {
                try {
                  if(!document.querySelector(".swiper-9a2794c").classList.contains("swiper-initialized")){
                    console.log("load swiper 9a2794c")
                    await atomiLoadSwiperCDN();
                    
      try {
        if (!window.swipers) {
          window.swipers = {};
        }
        if (window.swipers['9a2794c']) {
          window.swipers['9a2794c'].destroy(true, true);
        }
        window.swipers['9a2794c'] = new Swiper('.swiper-9a2794c', {
          loop: true,
          autoplay: { delay: 2000, pauseOnMouseEnter: false },
          speed: 900,
          spaceBetween: 10,
          direction: 'horizontal',
          navigation: {
            nextEl: '.swiper-9a2794c .swiper-button-next',
            prevEl: '.swiper-9a2794c .swiper-button-prev',
          },
          pagination: {
            el: '.swiper-9a2794c .swiper-pagination',
            clickable: true,
          },
          slidesPerView: 3,
          slidesPerGroup: 1,
          breakpoints: {
            300: {
              slidesPerView: 1,
              slidesPerGroup: 1,
              spaceBetween: 10,
            },
            640: {
              slidesPerView: 2,
              slidesPerGroup: 1,
              spaceBetween: 10,
            },
            1024: {
              slidesPerView: 3,
              slidesPerGroup: 1,
              spaceBetween: 10,
            },
          },
        });
      } catch (error) {
        console.log("swiper init error....");
        console.log(error);
      }
    
                    document.querySelector(".swiper-9a2794c").classList.remove("atomicat-hidden")
                  }
                } catch (error) {
                  console.error('Error initializing Swiper:', error);
                }
                atomi_slider9a2794c_observer.disconnect(); // Stop observing after initialization
              }
            });
          });

          atomi_slider9a2794c_observer.observe(atomi_slider9a2794c_ele);
        } catch (error) {
          console.log(error);
        }
      })();
      

      (function() {
        try {
          const atomi_sliderc31c8c8_ele = document.querySelector(".atomicat-slider-c31c8c8")
          const atomi_sliderc31c8c8_observer = new IntersectionObserver(async (entries) => {
            entries.forEach(async (entry) => {
              console.log(entry)
              if (entry.isIntersecting) {
                try {
                  if(!document.querySelector(".swiper-c31c8c8").classList.contains("swiper-initialized")){
                    console.log("load swiper c31c8c8")
                    await atomiLoadSwiperCDN();
                    
      try {
        if (!window.swipers) {
          window.swipers = {};
        }
        if (window.swipers['c31c8c8']) {
          window.swipers['c31c8c8'].destroy(true, true);
        }
        window.swipers['c31c8c8'] = new Swiper('.swiper-c31c8c8', {
          loop: true,
          autoplay: { delay: 2000, pauseOnMouseEnter: false },
          speed: 300,
          spaceBetween: 10,
          direction: 'horizontal',
          navigation: {
            nextEl: '.swiper-c31c8c8 .swiper-button-next',
            prevEl: '.swiper-c31c8c8 .swiper-button-prev',
          },
          pagination: {
            el: '.swiper-c31c8c8 .swiper-pagination',
            clickable: true,
          },
          slidesPerView: 3,
          slidesPerGroup: 1,
          breakpoints: {
            300: {
              slidesPerView: 1,
              slidesPerGroup: 1,
              spaceBetween: 10,
            },
            640: {
              slidesPerView: 2,
              slidesPerGroup: 1,
              spaceBetween: 10,
            },
            1024: {
              slidesPerView: 3,
              slidesPerGroup: 1,
              spaceBetween: 10,
            },
          },
        });
      } catch (error) {
        console.log("swiper init error....");
        console.log(error);
      }
    
                    document.querySelector(".swiper-c31c8c8").classList.remove("atomicat-hidden")
                  }
                } catch (error) {
                  console.error('Error initializing Swiper:', error);
                }
                atomi_sliderc31c8c8_observer.disconnect(); // Stop observing after initialization
              }
            });
          });

          atomi_sliderc31c8c8_observer.observe(atomi_sliderc31c8c8_ele);
        } catch (error) {
          console.log(error);
        }
      })();
      
    