import React from 'react';
import { Router } from '@reach/router';
import Dashboard from 'components/pages/vendor/Dashboard';
import AccountSetup from 'components/pages/vendor/setup/AccountSetup';
import Menu from 'components/pages/user/Menu';
import Properties from 'components/pages/shared/Properties';
import SingleProperty from 'components/pages/shared/SingleProperty';
import ScheduledVisits from 'components/pages/vendor/ScheduledVisits';
import CreateOfferTemplate from 'components/pages/vendor/CreateOfferTemplate';
import OfferTemplates from 'components/pages/vendor/OfferTemplates';
import SingleOfferTemplate from 'components/pages/vendor/SingleOfferTemplate';
import Transactions from 'components/pages/shared/Transactions';
import PropertyForm from 'components/pages/vendor/PropertyForm';
import Enquiries from 'components/pages/shared/Enquiries';
import SingleEnquiry from 'components/pages/shared/SingleEnquiry';
import Offers from 'components/pages/shared/Offers';
import SingleOffer from 'components/pages/shared/SingleOffer';
import AssignedProperties from 'components/pages/vendor/AssignedProperties';
import Gallery from 'components/pages/shared/Gallery';
import Portfolios from 'components/pages/shared/Portfolios';
import SinglePortfolio from 'components/pages/shared/SinglePortfolio';
import Notifications from 'components/pages/shared/Notifications';
import MyBadges from 'components/pages/shared/MyBadges';
import PendingOffers from 'components/pages/shared/PendingOffers';
import Testimonials from 'components/pages/shared/Testimonials';
import VasRequests from 'components/pages/shared/VasRequests';
import SingleVasRequest from 'components/pages/shared/SingleVasRequest';
import PersonalizedVas from 'components/pages/shared/PersonalizedVas';
import CreatePropertyTemplate from 'components/pages/vendor/CreatePropertyTemplate';
import PropertyTemplates from 'components/pages/vendor/PropertyTemplates';
import SinglePropertyTemplate from 'components/pages/vendor/SinglePropertyTemplate';

const VendorRouter = () => (
  <Router>
    <Dashboard path="dashboard" />
    <AccountSetup path="setup" />
    <AccountSetup path="setup/:id" />
    <Properties path="properties" />
    <SingleProperty path="property/:id" />
    <Portfolios path="portfolios" />
    <SinglePortfolio path="portfolio/:id" />
    <PropertyForm path="property/new" />
    <PendingOffers path="respond-to-offers" />
    <PropertyForm path="property/edit/:id" />
    <ScheduledVisits path="scheduled-visits" />
    <Enquiries path="enquiries" />
    <SingleEnquiry path="enquiry/:id" />
    <Offers path="offers" />
    <SingleOffer path="offer/:id" />
    <AssignedProperties path="assigned-properties" />
    <Transactions path="transactions" />
    <Gallery path="gallery/:propertyId" />
    <Notifications path="notifications" />
    <MyBadges path="mybadges" />
    <Testimonials path="testimonials" />
    <PersonalizedVas path="vas" />
    <VasRequests path="service/requests" />
    <SingleVasRequest path="service/requests/:id" />
    <CreateOfferTemplate path="offer/template/:id" />
    <OfferTemplates path="offer-templates" />
    <SingleOfferTemplate path="offer-template/:id" />

    <CreatePropertyTemplate path="property/template/:id" />
    <PropertyTemplates path="property-templates" />
    <SinglePropertyTemplate path="property-template/:id" />
    <Menu path="menu" />
  </Router>
);

export default VendorRouter;
