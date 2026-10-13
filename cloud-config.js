/* ============================================================
   云服务公共配置（平台下发的 publicConfig）

   这三个值都是「可以公开」的，写进前端源码是设计如此：
     resourceId     资源编号，只是标识
     endpoint       本应用的发布域名（云服务的唯一正确来源，不能改成别的）
     publishableKey 只标识「是哪个应用」，本身不带任何权限
   服务端会额外校验请求来源域名（Origin 必须与发布域名完全一致），
   所以这个 key 泄露出去也无法被别的网站冒用。

   真正有权限的密钥永远留在服务端，不会出现在这里。
   ============================================================ */
window.CLOUD_PUBLIC_CONFIG = {
  resourceId: "wbcs_hGjHuWGjSspq1HohJqvOhZ",
  endpoint: "https://embedded-encyclopedia.app.workbuddy.host",
  publishableKey: "wbpk_xOYW6atOHyPJyE7hWttY6G_16CknMhoUCY7UULFZggzIcke9oYS6Hl3"
};
