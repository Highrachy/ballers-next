import React from 'react';
import Header from 'components/layout/Header';
import Footer from 'components/layout/Footer';
import TitleSection, {
  EmptyTitleSection,
} from '@/components/common/TitleSection';
import { Content } from 'pages/create-a-new-ball-account';
import SeoHead from '@/components/utils/SeoHead';

const Register = () => (
  <>
    <Header />
    <SeoHead
      title="BALL VIP Sellers Registration | Create Your Vendor Account"
      description="Register as a BALL VIP seller to list properties, manage sales, and reach potential buyers. Start your vendor journey today on BALL."
      canonical="https://www.ballers.ng/ball-vips/register"
      keywords={[
        'BALL VIP registration',
        'vendor account Nigeria',
        'property seller registration',
        'BALL vendor signup',
        'list properties Nigeria',
      ]}
    />
    <TitleSection
      name="Sellers Registration Page"
      content="Create a new Seller account"
    />
    {/* Hidden SEO section */}
    {/* Hidden SEO section */}
    <section className="visually-hidden">
      <div className="h1">Register as a BALL VIP Seller</div>

      <p>
        Become a verified BALL VIP seller and start listing your properties
        across Lagos and Nigeria. Our platform helps property owners showcase
        their homes to a wide audience and manage listings efficiently.
      </p>

      <p>
        Registration is simple, fast, and secure. Provide your business and
        personal information, verify your account, and gain access to powerful
        tools for managing listings, promoting properties, and tracking buyer
        inquiries.
      </p>

      <p>
        As a VIP seller, you benefit from featured listings, analytics to
        monitor buyer engagement, and priority support from the BALL team. These
        tools help you enhance property visibility and grow your real estate
        business confidently.
      </p>

      <p>
        VIP sellers enjoy additional advantages including access to verified
        buyers, notifications for interested clients, and insights into market
        trends to make smarter sales decisions.
      </p>

      <p>
        Your listings are displayed with credibility, allowing serious buyers to
        find your properties quickly. BALL VIP ensures maximum exposure and
        strengthens your reputation in the Nigerian real estate market.
      </p>

      <p>
        Start your registration today to unlock all VIP seller tools, manage
        your listings effectively, connect with potential buyers, and take your
        property sales to the next level with BALL.
      </p>

      <p>
        With BALL VIP, you can focus on growing your business while we provide a
        secure, reliable, and efficient platform for property management,
        marketing, and buyer engagement across Nigeria.
      </p>
    </section>
    <EmptyTitleSection>
      <Content currentUser="vendor" showVendorOnly />
    </EmptyTitleSection>
    <Footer />
  </>
);

export default Register;
