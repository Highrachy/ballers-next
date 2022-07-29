import React from 'react';
import { Router } from '@reach/router';
import Dashboard from 'components/pages/admin/Dashboard';
import Users from 'components/pages/admin/Users';
import SingleUser from 'components/pages/admin/SingleUser';
import Properties from 'components/pages/shared/Properties';
import SingleProperty from 'components/pages/shared/SingleProperty';
import ScheduledVisits from 'components/pages/admin/ScheduledVisits';
import Transactions from 'components/pages/admin/AdminTransactions';
import KnowledgeBase from 'components/pages/admin/KnowledgeBase';
import Menu from 'components/pages/user/Menu';
import Enquiries from 'components/pages/shared/Enquiries';
import SingleEnquiry from 'components/pages/shared/SingleEnquiry';
import AssignedProperties from 'components/pages/admin/AssignedProperties';
import AddTransaction from 'components/pages/admin/AddTransaction';
import NewTransaction from 'components/pages/admin/NewTransaction';
import Offers from 'components/pages/shared/Offers';
import PendingOffers from 'components/pages/shared/PendingOffers';
import SingleOffer from 'components/pages/shared/SingleOffer';
import Portfolios from 'components/pages/shared/Portfolios';
import SinglePortfolio from 'components/pages/shared/SinglePortfolio';
import Notifications from 'components/pages/shared/Notifications';
import ReportedProperties from 'components/pages/admin/ReportedProperties';
import Referrals from 'components/pages/admin/Referrals';
import Badges from 'components/pages/admin/Badges';
import BankAccount from 'components/pages/admin/BankAccount';
import MyBadges from 'components/pages/shared/MyBadges';
import AddBadges from 'components/pages/admin/AddBadges';
import SingleBadge from 'components/pages/admin/SingleBadge';
import PropertyVideos from 'components/pages/admin/PropertyVideos';
import Testimonials from 'components/pages/shared/Testimonials';
import SMSReport from 'components/pages/admin/SMSReport';
import Vas from 'components/pages/admin/Vas';
import AddVas from 'components/pages/admin/AddVas';
import VasRequests from 'components/pages/shared/VasRequests';
import SingleVasRequest from 'components/pages/shared/SingleVasRequest';

const AdminRouter = () => (
  <Router>
    <Dashboard path="dashboard" />
    <Users path="users" />
    <SingleUser path="user/:id" />
    <Properties path="properties" />
    <ReportedProperties path="reported-properties" />
    <PropertyVideos path="property-videos" />
    <SingleProperty path="property/:id" />
    <Portfolios path="portfolios" />
    <SinglePortfolio path="portfolio/:id" />
    <ScheduledVisits path="scheduled-visits" />
    <SingleEnquiry path="enquiry/:id" />
    <AssignedProperties path="assigned-properties" />
    <Enquiries path="enquiries" />
    <Transactions path="transactions" />
    <Offers path="offers" />
    <PendingOffers path="review-offers" />
    <SingleOffer path="offer/:id" />
    <AddTransaction path="add-transaction" />
    <NewTransaction path="transactions/new/:offerId" />
    <KnowledgeBase path="knowledgebase" />
    <Notifications path="notifications" />
    <Referrals path="referrals" />
    <Badges path="badges" />
    <BankAccount path="bank-accounts" />
    <MyBadges path="mybadges" />
    <AddBadges path="badges/new" />
    <SingleBadge path="badge/:id" />
    <Testimonials path="testimonials" />
    <SMSReport path="sms-report" />
    <Vas path="service" />
    <AddVas path="service/new" />
    <VasRequests path="service/requests" />
    <SingleVasRequest path="service/requests/:id" />
    <Menu path="menu" />
  </Router>
);

export default AdminRouter;
