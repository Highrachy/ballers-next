import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Image from 'next/image';
import Slider from 'react-slick';
import Header from '@/components/layout/Header';
import CommunityGallery from '@/components/common/CommunityGallery';
import Footer from '@/components/layout/Footer';
import TitleSection from '@/components/common/TitleSection';
import FAQsAccordion from '@/components/common/FAQsAccordion';
import FAQsContent from '@/data/faqs';
import { LocalImage } from '@/components/utils/Image';

const FAQs = () => {
  const categories = Object.keys(FAQsContent);
  const [category, setCategory] = React.useState(categories[0]);
  const [foundFAQs, setFoundFAQs] = React.useState([]);
  const [searchTerm, setSearchTerm] = React.useState(null);
  const myRef = React.createRef();

  const updateCategory = (category) => {
    setCategory(category);
    setFoundFAQs([]);
    setSearchTerm(null);
  };

  const processFoundFAQs = (faqs, searchTerm) => {
    setFoundFAQs(faqs);
    setCategory(null);
    setSearchTerm(searchTerm);
    window.scrollTo({ behavior: 'smooth', top: myRef.current.offsetTop });
  };

  return (
    <>
      <Header />
      <TitleSection
        name="Frequently Asked Questions"
        content={
          <>
            Are you looking for an answer to your questions about BALL?
            <br className="d-none d-lg-block" />
            Here we have compiled an overview of frequently asked questions we
            receive from our BALLers
          </>
        }
      >
        <FAQSearch processFoundFAQs={processFoundFAQs} />
      </TitleSection>
      <FAQCategory
        categories={categories}
        currentCategory={category}
        updateCategory={updateCategory}
        searchResultCount={foundFAQs.length}
      />
      <AllFAQs
        faqs={FAQsContent[category]}
        searchResult={foundFAQs}
        searchTerm={searchTerm}
        myRef={myRef}
      />
      <MoreQuestions />
      <CommunityGallery />
      <Footer />
    </>
  );
};

export const FAQSearch = ({ processFoundFAQs }) => {
  const [value, setValue] = React.useState('');

  const searchFAQs = () => {
    const searchResult = Object.values(FAQsContent).reduce(
      (result, { faqs, name }) => {
        const foundFAQs = faqs.filter(({ question, answer }) => {
          const processedQuestion = question.props
            ? question.props.children
            : question;
          console.log('answer', answer);
          // const processedAnswer = answer.props ? answer.props.children : answer;
          const processedAnswer = '';

          console.log('processedAnswer', processedAnswer);

          const searchTerms = value.split(' ');

          return searchTerms.find((term) => {
            const searchTerm = term.toLowerCase();
            return (
              processedQuestion?.toLowerCase().includes(searchTerm) ||
              processedAnswer?.toLowerCase().includes(searchTerm) ||
              name?.toLowerCase().includes(searchTerm)
            );
          });
        });
        return [...result, ...foundFAQs];
      },
      []
    );
    processFoundFAQs(searchResult, value);
    setValue('');
  };

  return (
    <section className="col-lg-8 col-sm-10 col-11 mx-auto mt-4">
      <form className="faqs-search-form mx-auto">
        <div className="input-group flex-nowrap">
          <div className="input-group-prepend">
            <span className="input-group-text">
              <Image
                src="/img/icons/search-icon.png"
                alt="search icon"
                className="img-fluid"
                width="35"
                height="35"
              />
            </span>
          </div>

          <input
            type="text"
            className="form-control"
            placeholder="Search for a question..."
            value={value}
            onChange={(e) => setValue(e.target.value)}
            aria-label="Search for a question..."
          />
          <div className="input-group-append">
            <button
              className={classNames('btn btn-secondary', {
                disabled: !value || value.length < 3,
              })}
              type="button"
              onClick={searchFAQs}
            >
              Search
            </button>
          </div>
        </div>
      </form>
    </section>
  );
};

FAQSearch.propTypes = {
  processFoundFAQs: PropTypes.func.isRequired,
};

const FAQCategory = ({
  categories,
  currentCategory,
  searchResultCount,
  updateCategory,
}) => {
  const settings = {
    speed: 500,
    infinite: true,
    centerMode: true,
    autoplay: true,
    arrows: false,
    autoplaySpeed: 4000,
    slidesToScroll: 1,
    centerPadding: '0',
    slidesToShow: 4,
    dots: true,
    appendDots: (dots) => <span className="faq-slider-dot">{dots}</span>,
    useTransform: true,
    cssEase: 'ease-in-out',
    responsive: [
      {
        breakpoint: 992,
        dots: true,
        useTransform: true,
        cssEase: 'ease-in-out',
        settings: {
          centerMode: true,
          centerPadding: '0',
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 576,
        dots: true,
        settings: {
          centerMode: true,
          centerPadding: '0',
          slidesToShow: 1,
        },
      },
    ],
  };

  if (searchResultCount > 0) return null;

  return (
    <section className="faq-category bg-light-blue py-5">
      <p className="text-center">
        or chooose a category to quickly find the help you need
      </p>
      <div className="container-fluid">
        <Slider {...settings} className="faq-category-slide">
          {categories.map((category, index) => (
            <div
              className={classNames({ active: category === currentCategory })}
              key={index}
              onClick={() => updateCategory(category)}
            >
              <LocalImage
                src={FAQsContent[category].icon}
                className="img-fluid"
                alt={`${FAQsContent[category].name} icon`}
              />
              <h6>{FAQsContent[category].name}</h6>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

FAQCategory.propTypes = {
  categories: PropTypes.array.isRequired,
  currentCategory: PropTypes.string.isRequired,
  searchResultCount: PropTypes.number.isRequired,
  updateCategory: PropTypes.func.isRequired,
};

const AllFAQs = ({ faqs, myRef, searchResult, searchTerm }) => {
  const faqsToShow =
    searchResult.length > 0 ? searchResult : (faqs && faqs.faqs) || [];
  return (
    <section className="container-fluid py-6" ref={myRef}>
      <div className="row">
        <div className="offset-lg-2 col-lg-8">
          {!searchTerm ? (
            <>
              <h2 className="text-center">{faqs.name}</h2>
              <p className="lead text-center">{faqs.description}</p>
            </>
          ) : (
            <h2 className="text-center">
              {searchResult.length > 0
                ? 'Search Results'
                : 'No Search Result Found'}{' '}
              for <span className="text-secondary">{searchTerm}</span>
            </h2>
          )}
          <div className="row">
            <div className="mt-5 col-12 faqs-section">
              <FAQsAccordion faqs={faqsToShow} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

AllFAQs.propTypes = {
  faqs: PropTypes.object.isRequired,
  myRef: PropTypes.object.isRequired,
  searchResult: PropTypes.array.isRequired,
  searchTerm: PropTypes.string,
};

FAQs.defaultProps = {
  searchTerm: null,
};

const MoreQuestions = () => (
  <section className="container-fluid">
    <h3 className="text-center mt-5">You still have a question?</h3>
    <p className="text-center lead mt-4">
      If you cannot find answer to your question in our FAQ, you can <br />{' '}
      always contact us . We will be with you shortly!
    </p>
    <div className="row mt-5">
      <aside className="col-lg-4 offset-lg-2 col-md-5 col-12 faq-contact-card">
        <Image
          src="/img/icons/phone-icon.png"
          alt="Phone icon"
          width="70"
          height="70"
        />
        <h5 className="text-lg mt-4">+234 807 654 5543</h5>
        <p className="text-muted">We are always happy to help.</p>
      </aside>
      <aside className="col-lg-4 col-md-5 col-12 faq-contact-card">
        <Image
          src="/img/icons/mail-icon.png"
          alt="Mail icon"
          width="70"
          height="70"
        />
        <h5 className="text-lg mt-4">
          <a
            className="text-primary"
            href="mailto:info@ballers.ng"
            target="_blank"
            rel="noopener noreferrer"
          >
            info@ballers.ng
          </a>
        </h5>
        <p className="text-muted">The best way to get answer faster.</p>
      </aside>
    </div>
  </section>
);

export default FAQs;
