/*
    
    Web siteleri için dinamik, yapılandırılabilir slider framework'u.
    Nesnenin mevcut genişliğine göre içeriği şekillendirebilirsiniz. Mobil için de uygundur.
    © Adazure Interactive. www.adazure.com.
    Geliştirici Kerem YAVUZ
    05/2016
 */

(function(){
    
    function touchslider(a){
        
        //Framework içerisinde kullanılacak nesneler
        var context = a.children[0];
        var slider = a;                             //Sayfa üzerindeki slider nesnesi
        var children = context.children;            //Slider nesnesi içerisindeki her bir kayıt
        var leftArrow = null;                       //Eğer kullanıcı tarafından bildirilecekse, sol buton nesnesi ID'si
        var rightArray = null;                      //Eğer kullanıcı tarafından bildirilecekse, sağ buton nesnesi ID'si
        var currentPage = 1;                        //Sayfa bazında hareketlerde, gösterilen sayfanın o anki sayfa numarası 1,2,3,4,5,6 vs
        var currentIndex = 0;                       //Kayıt bazında hareketlerde, gösterilen kaydın o anki index numarası
        var maxPage = 0;                            //Sayfa bazında hareketlerde, slider alanı içerisinde gösterilen kaydın toplam kayda bölünerek bulunduğu maksimum sayfa sayısı
        var currentWidth = 0;                       //Tek bir kaydın o anki boyutunun pixel uzunluğunu tutar
        var showCount = 0;                          //Sayfa boyutlandırmalarında geliştiricinin belirtmiş olduğunu o an ki gösterilecek kayıt sayısını verir
        
        //Frameworkun varsayılan ayarları, geliştirici tarafından nesne içerisinden de bilgi gönderilecek genişletilebilir
        var control = {
            loop:true,
            interval:4000,
            left:null,
            right:null,
            type:'item'};   
        //Frameworkun varsayılan boyut alarları
        var setting = [
            {min:0,max:460,count:1},
            {min:461,max:800,count:2},
            {min:0,max:0,count:3}
        ];
        
        //Geliştirici tarafından, varsa gönderilen control değerleri alır
        var getControl = slider.getAttribute('data-control');
        if(getControl){    
            getControl = eval('['+getControl+']')[0];    
            for (var key in getControl) {
                if (control.hasOwnProperty(key)) {
                    control[key] = getControl[key];
                }
            }
        }
        
        //Loop
        var loop = (function(){
            
            var loopTimer = 0;
            
            //Construc
            function _loop(){}
            
            //Loop Start
            _loop.start = function(){
                
                //Geliştirici tarafından loop özelliği aktif edilmişse
                if(control.loop == true){
                    
                    //Varsa önce çalışan loop değerini sıfırla
                    loop.stop();
                    
                    //Yeni bir loop döngüsü çalıştır
                    loopTimer = window.setTimeout(function(){
                        
                        //Loop sırasında page bazlımı yoksa kayıt bazlımı hareket edeceği yönünde kontrol sağlanıyor
                        if(control.type == 'page'){
                            //Sayfa sonuna gelene kadar ilerle, değilse başa dön
                            if(currentPage < maxPage){
                                pages.next();
                            }else{
                                pages.go(1);
                            }
                        }
                        
                        else if(control.type == 'item'){
                            //Kayıt sonuna gelene kadar ilerle, değilse başa dön
                            if(currentIndex < (children.length - showCount)){
                                ++currentIndex;
                                pages.step();
                            }else{
                                 currentIndex = 0;
                                pages.step();
                            }
                        }
                        loop.start();
                    },control.interval);
                }
            }
            
            //Loop Stop. Kullanımda olan loop nesnesi varsa sonlandırır
            _loop.stop = function(){
                window.clearTimeout(loopTimer);    
            }
            
            return _loop;
            
        })();
        
        
        //Slider alanının hareket ve yönlendirme işlemlerinin tamamı bu alanda yapılmakta
        //Buton etkileşimleri, ileri/geri olayları bu alandadır.
        //Bu alanda sayfa bazında ilerleme ve kayıt bazında ilerle kontrolleri yapılmaktadır.
        var pages = (function(){
            
            //Constructor
            var _init = function(){}
            
            //Maksimum sayfa sayısı
            maxPage = 1;
            
            //En son sayfada görünen kayıt sayısı, gosterilecek kayıttan az ise deger burada saklanacak
            var lastPageChildCount = 0;
            
            //Cagrıldıgında her boyutlandırma sırasında sayfa sayısını hesaplayan method
            _init.maxPage = function(){
                //Sıfırlama
                maxPage = 0;
                lastPageChildCount = 0;
                
                //Hesaplama icin nesne sayısını alıyoruz
                var z = children.length;
                //Nesne sayısından gosterilecek kayıt sayısını cıkararak sayfa sayısını buluyoruz
                while( z > 0){
                    
                    if(z >= showCount){
                        maxPage++;
                        z-= showCount;
                    }else if(z > 0){
                        //son sayfada 0 dan buyuk ama gosterilecek kayıttan az ise 1 sayfa daha ekliyoruz ve son sayfadaki gorunen kayıt sayısını bildiriyoruz
                        //Boylece sayfa olarak kayma islemi sırasında,sonda boslus olusmaması adına sadece kayıt sayısı kadar surukleme yapılacak
                        maxPage++;
                        lastPageChildCount = z;
                        z = 0;
                    }
                }
                
            }
            
            //Sonraki sayfaya hareket eder
            _init.next = function(){
                
                //İlgili akış sayfa tipinde ise 
                //İlgili slider nesnesinin kapladığı alan içerisinde gösterilen kayıt sayısı kadar hareket eder
                if(control.type == 'page'){
                    
                    if(currentPage < maxPage)
                    {
                        currentPage++;
                        _init.go();
                        loop.start(); 
                    }
                 
                    disabledButton('page');
                      
                }
                //İlgili akış kayıt tipinde ise
                //İlgili slider nesnesi içindeki sadece bir kayıt genisligi kadar hareket eder
                else if(control.type == 'item'){
                    
                     if(currentIndex < (children.length - showCount))
                     {
                         currentIndex++;
                         _init.step();
                         loop.start(); 
                     }
                    
                    disabledButton('item');
                }
                
            }
            
            //Geri doğru ilerleme sağlar
            _init.prev = function(){
                if(control.type == 'page'){
                                        
                    if(currentPage > 1)
                    {
                        currentPage--;
                        _init.go();
                        loop.start(); 
                    }
                    
                    disabledButton('page');
                    
                }
                else if(control.type == 'item'){
                    
                   
                     if(currentIndex > 0)
                     {
                         currentIndex--;
                         _init.step();
                         loop.start(); 
                     }
                     
                    disabledButton('item');
                    
                }
            }
            
            //Sayfa bazında ki hareketler burada yapılır.
            _init.go = function(){
                
                var lastPage = currentPage >= maxPage;
                
                //Gosterilmesi istenen sayfa numarasını parametreden alıp 1 eksiltiyoruz.
                //Boylece x koordinatında 0 etkisiz eleman olacağından nesne left pozisyonunda 0px e esitlenecek 
                var nx = (currentPage < 1 ? 0 : currentPage - 1);

                nx = nx > maxPage ? maxPage : nx;

                //Öncelikle son sayfa olup olmadığını control edeceğiz
                //Eğer değilse normal sekilde akıs sağlanacak
                //Eğer sayfa sona gelmiş ise son sayfadaki kayıt sayısına bakıp ona gore hareket ettireceğiz
                
                if(!lastPage || (lastPage && lastPageChildCount == 0)){
                    //sayfa sayısı ve gosterilecek sayıyı carpıp, hareket edilecek genislik miktarı ile tekrar carpıyoruz
                    //nesnenin left koordinatında kac pixel -(eksi) solda duracagını belirtiyoruz
                    context.style.left = -(nx * showCount * currentWidth) + 'px';
                }else{
                    //sadece son sayfada kalan kayıt kadar hareket ettir
                    context.style.left = -((nx * showCount * currentWidth) + (-(showCount - lastPageChildCount) * currentWidth)) + 'px';
                }
                
            }
            
            //Birim bazında hareket bu alanda yapılır
            _init.step = function(){
                    context.style.left = -(currentIndex * currentWidth) + 'px';
            }
            
            
            return _init;
        })();
        
        //Geliştiriciden gelen ayar değerleri varsa al
        var getSet = slider.getAttribute('data-setting');
        setting = getSet ? eval(getSet) : setting;

        //Gelen ayar verilerini en büyükten en küçüğe doğru sıralar
        setting.sort(function(a,b){return a.max < b.max});

        //Slider hareketi esnasında varsa aktif butonlarında etkinleştirme/etkişizleştirme işlemleri yapalım
        //Kullanıcı bastıgında veya loop özelliklerinde de otomatik olarak kontrolünü sağlayalım
        //Kayıt başa geldiğinde ve sona geldiğinde ilgili butonları etkin/pasif konuma getiren methodumuz
        
        function disabledButton(type){
          
          if(type == 'page'){
              
              //Geliştirici tarafından buton bildirildiyse. Yoksa hata alırız
              if(control.right){
                //Son sayfaya gelindiğinde
                if(currentPage >= maxPage)
                    control.right.classList.add('disabled');
                else
                    control.right.classList.remove('disabled');
              }
              
              //Geliştirici tarafından buton bildirildiyse.
              if(control.left){
                  
                  if(currentPage <= 1)
                      control.left.classList.add('disabled');
                  else
                      control.left.classList.remove('disabled');
                  
              }
              
          }
          else if(type == 'item'){
              
              
               //Geliştirici tarafından buton bildirildiyse. Yoksa hata alırız
              if(control.right){
                //Son sayfaya gelindiğinde
                if(currentIndex >= (children.length - showCount))
                    control.right.classList.add('disabled');
                else
                    control.right.classList.remove('disabled');
              }
              
              //Geliştirici tarafından buton bildirildiyse.
              if(control.left){
                  
                  if(currentIndex <= 0)
                      control.left.classList.add('disabled');
                  else
                      control.left.classList.remove('disabled');
                  
              }
              
              
          }
          
        }

        function onmouseover(){
            loop.stop();
        }

        function onmouseout(){
            loop.start();
        }
        
        var touchStartX = 0;
        
        function touchstart(e){
            loop.stop();
            touchStartX = e.targetTouches[0].clientX - slider.offsetLeft - context.getStyleValue('left');
        }
        
        function touchend(e){
            loop.start();
        }
        
        function touchmove(e){
            var z = (e.targetTouches[0].clientX - slider.offsetLeft) - touchStartX;

            if(z < (slider.offsetWidth - context.offsetWidth))
            {
                z = (slider.offsetWidth - context.offsetWidth);
            }
            else if(z > 0){
                z = 0;
            }
            
            context.style.left = z + 'px';
        }
        
        //Slider alanı üzerine gelindiğinde veya butonlar üzerine gelindiğinde loop özelliğini devredışı bırakılacak
        slider.onmouseover = onmouseover;
        slider.onmouseout = onmouseout;
        
        //Eğer geliştirici tarafından butonlar bildirilmişse, bunların da etkileşimini sağlayalım
        if(control.left)
        {
            control.left = document.getElementById(control.left);
            control.left.onclick = pages.prev;
            control.left.onmouseover = onmouseover;
            control.left.onmouseout = onmouseout;
        }
        
        if(control.right)
        {
            control.right = document.getElementById(control.right);
            control.right.onclick = pages.next;
            control.right.onmouseover = onmouseover;
            control.right.onmouseout = onmouseout;
        }
        
        //Mobile etkileşimi için touch özelliği burada ekleniyor
        addEventListener(context,'touchstart',touchstart);
        addEventListener(context,'touchend',touchend);
        addEventListener(context,'touchmove',touchmove);
        
        
        //Elemente ait özellik ekleme
        Element.prototype.getStyleValue = function(name){
            return parseInt(this.style[name],10);
        }


        //Ekran her boyutlandırıldığında nesne genişliği kontrol edilir
        var resize = function(){
            
            //Sayfanın boyutlandırılması esnasında varsayılan değerlerde slider nesnesi en başa gönderiyoruz
            currentPage = 1;
            currentIndex = 0;
            
            //Responsive sayfa tasarımlarında, slider nesnesi dinamik olabileceğinden o an ki slider nesnesinin genişliğini alır
            var width = slider.offsetWidth;
           
           //Geliştirici tarafından gelen her bir görüntüleme değerleri listesini tek tek kontrol eder. 
           //Slider genişliğine en uygun değerleri bulur ve gösterilecek kayıt sayısını ayarlar
            for(var n = 0; n < setting.length; n++){

                if(width >= setting[n].min && width <=setting[n].max && setting[n].max != 0){
                    showCount = setting[n].count;
                    break;
                }
                else if(setting[n].min == 0 && setting[n].max == 0){
                    showCount = setting[n].count;
                    break;
                }
                
            }
            
                    
            //Hareket nesnesinin genişliğini ve her bir nesnenin genişliğini oluşturur
            
                //Her bir kaydın o an ki genişlik değeri
                currentWidth = width / showCount;                               
                //Slider nesnesinin içerisindeki kaydırılır nesnenin(context) genişliğini, görüntülenen tek bir kaydın genişliği oranında toplam kayıt sayısıyla çarparak context'in genişliğini belirliyoruz.
                context.style.width = (currentWidth) * children.length + 'px';  
                //Sayfa boyutlandırmalarında hersey en başa döndürülüyor. Bu nedenle context'in left değeri 0 sıfırlanıyor.  
                context.style.left = '0px';                                     
                //addWidth metodu ile her bir kaydın genişliğini o nesneye uygulatıyoruz
                addWidth(currentWidth);                                         
                //Boyutlandırmalarda o an gösterilecek kayıt sayısı adedince, toplam oluşacak sayfa sayısını tekrar hesaplatıyoruz
                pages.maxPage();                                                
                //Geliştirici tarafından loop özelliği açık/kapalı olup olmamasına bakılmaksızın çalıştırıyoruz. Method içerisinde açık/kapalı kontrolü mevcuttur
                loop.start();                                                   
        }
        
        //Her bir nesneye belirtilen oranda genişlik değeri atanıyor
        function addWidth(width){
                for (var index = 0; index < children.length; index++) {
                    children[index].style.width = width + 'px';
                }
        }
        
  
        
        //Nesne yüklendiğinde boyutlandırma methodu bildirilir
        addEventListener(window,'resize',resize);
        
        //Init. Sayfa yüklendiğinde boyutlandırma işlemi çalıştırılır. Böylece bildiren boyut bilgileri için ilk hesaplama yapılır
        resize();

        //Loop
        loop.start();
        
        //Buton aktif/pasif
        disabledButton(control.type);
        
    }
    
    function init(){
        
        //Sayfa üzerinde ki tüm touchslider class ismine sahip nesneleri çağırır
        var el = document.getElementsByClassName('touchslider');
        
        if(el && el.length > 0){
            for(var i = 0; i < el.length; i++){
                //Her bir nesneyi slider etkileşimine sokar
                new touchslider(el[i]);
            }
        }
    }
    
    function addEventListener(obj,name,method){
        
        if(obj.addEventListener)
        obj.addEventListener(name,method,false);
        else
        obj.attachEvent('on'+name,method);
        
    }
    
    //Sayfa yüklendiğinde çalıştırılır
    addEventListener(window,'load',init);
    
    
})()