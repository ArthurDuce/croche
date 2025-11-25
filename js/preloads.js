
    (function() {
      var cdnOrigin = "https://cdn.shopify.com";
      var scripts = ["/cdn/shopifycloud/checkout-web/assets/c1/polyfills.Ba0kryUm.js","/cdn/shopifycloud/checkout-web/assets/c1/app._66QYRma.js","/cdn/shopifycloud/checkout-web/assets/c1/locale-en.DerwzvmI.js","/cdn/shopifycloud/checkout-web/assets/c1/page-Information.BSERrx5f.js","/cdn/shopifycloud/checkout-web/assets/c1/PaymentButtons.BZ_f7U2Z.js","/cdn/shopifycloud/checkout-web/assets/c1/DeliveryMethodSelectorSection.a4fKkYcW.js","/cdn/shopifycloud/checkout-web/assets/c1/useEditorShopPayNavigation.Bx1jLni0.js","/cdn/shopifycloud/checkout-web/assets/c1/VaultedPayment.DVr1qBJR.js"];
      var styles = ["/cdn/shopifycloud/checkout-web/assets/c1/assets/app.Du6SSCMk.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/DeliveryMethodSelectorSection.BvrdqG-K.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/useEditorShopPayNavigation.CBpWLJzT.css","/cdn/shopifycloud/checkout-web/assets/c1/assets/VaultedPayment.OxMVm7u-.css"];
      var fontPreconnectUrls = ["https://fonts.shopifycdn.com"];
      var fontPrefetchUrls = ["https://fonts.shopifycdn.com/poppins/poppins_n4.0ba78fa5af9b0e1a374041b3ceaadf0a43b41362.woff2?h1=Y2lhbGlzdG9nZXRoZXIuY28udWs&hmac=f494b17f0da0f0d251c73eb4a2c9a06b5d0298850f82587b97383141dafaed5d","https://fonts.shopifycdn.com/poppins/poppins_n7.56758dcf284489feb014a026f3727f2f20a54626.woff2?h1=Y2lhbGlzdG9nZXRoZXIuY28udWs&hmac=2f35429383d7ebdf3a4f0b78252d5e04682df520f561f7a4bf6f8f9574990d67"];
      var imgPrefetchUrls = ["https://cdn.shopify.com/s/files/1/0789/6740/6914/files/Logo-CialsiTogether-Gold_1_430x_9a59dba1-0952-4268-ae20-4d8a6de8db58_x320.png?v=1689070147","https://cdn.shopify.com/s/files/1/0789/6740/6914/files/Black_flag_2000x.png?v=1690988073"];

      function preconnect(url, callback) {
        var link = document.createElement('link');
        link.rel = 'dns-prefetch preconnect';
        link.href = url;
        link.crossOrigin = '';
        link.onload = link.onerror = callback;
        document.head.appendChild(link);
      }

      function preconnectAssets() {
        var resources = [cdnOrigin].concat(fontPreconnectUrls);
        var index = 0;
        (function next() {
          var res = resources[index++];
          if (res) preconnect(res, next);
        })();
      }

      function prefetch(url, as, callback) {
        var link = document.createElement('link');
        if (link.relList.supports('prefetch')) {
          link.rel = 'prefetch';
          link.fetchPriority = 'low';
          link.as = as;
          if (as === 'font') link.type = 'font/woff2';
          link.href = url;
          link.crossOrigin = '';
          link.onload = link.onerror = callback;
          document.head.appendChild(link);
        } else {
          var xhr = new XMLHttpRequest();
          xhr.open('GET', url, true);
          xhr.onloadend = callback;
          xhr.send();
        }
      }

      function prefetchAssets() {
        var resources = [].concat(
          scripts.map(function(url) { return [url, 'script']; }),
          styles.map(function(url) { return [url, 'style']; }),
          fontPrefetchUrls.map(function(url) { return [url, 'font']; }),
          imgPrefetchUrls.map(function(url) { return [url, 'image']; })
        );
        var index = 0;
        function run() {
          var res = resources[index++];
          if (res) prefetch(res[0], res[1], next);
        }
        var next = (self.requestIdleCallback || setTimeout).bind(self, run);
        next();
      }

      function onLoaded() {
        try {
          if (parseFloat(navigator.connection.effectiveType) > 2 && !navigator.connection.saveData) {
            preconnectAssets();
            prefetchAssets();
          }
        } catch (e) {}
      }

      if (document.readyState === 'complete') {
        onLoaded();
      } else {
        addEventListener('load', onLoaded);
      }
    })();
  