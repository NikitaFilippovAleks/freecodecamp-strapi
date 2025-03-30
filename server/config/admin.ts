const getPreviewPathname = (uid, { locale, document }): string => {
  const { slug } = document;
  console.log('______HERE_______',uid, slug);
  // Handle different content types with their specific URL patterns
  switch (uid) {
    // Handle pages with predefined routes
    case "api::page.page":
      switch (slug) {
        case "experience":
          return `/experience`; // Localized homepage
        case "blog":
          return "/blog"; // Pricing page // FAQ page
      }
    // Handle product pages
    // case "api::product.product": {
    //   if (!slug) {
    //     return "/products"; // Products listing page
    //   }
    //   return `/products/${slug}`; // Individual product page
    // }
    // // Handle blog articles
    // case "api::article.article": {
    //   if (!slug) {
    //     return "/blog"; // Blog listing page
    //   }
    //   return `/blog/${slug}`; // Individual article page
    // }
    default: {
      return null;
    }
  }
};

export default ({ env }) => {
  // Get environment variables
  const clientUrl = env("CLIENT_URL"); // Frontend application URL
  const previewSecret = env("PREVIEW_SECRET"); // Secret key for preview authentication

  return {
    auth: {
      secret: env('ADMIN_JWT_SECRET'),
    },
    apiToken: {
      salt: env('API_TOKEN_SALT'),
    },
    transfer: {
      token: {
        salt: env('TRANSFER_TOKEN_SALT'),
      },
    },
    flags: {
      nps: env.bool('FLAG_NPS', true),
      promoteEE: env.bool('FLAG_PROMOTE_EE', true),
    },
    preview: {
      enabled: true, // Enable preview functionality
      config: {
        allowedOrigins: clientUrl, // Restrict preview access to specific domain
        async handler(uid, { documentId, locale, status }) {
          // Fetch the complete document from Strapi
          const document = await strapi.documents(uid).findOne({ documentId });
          
          // Generate the preview pathname based on content type and document
          const pathname = getPreviewPathname(uid, { locale, document });

          // Disable preview if the pathname is not found
          if (!pathname) {
            return null;
          }

          // Use Next.js draft mode passing it a secret key and the content-type status
          const urlSearchParams = new URLSearchParams({
            url: pathname,
            secret: previewSecret,
            status,
          });
          return `${clientUrl}/api/preview?${urlSearchParams}`;
        },
      },
    },
  }
};
