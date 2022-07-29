import React from 'react';
import Header from 'components/layout/Header';
import Footer from 'components/layout/Footer';
import ArticleImage from 'assets/img/placeholder/article.jpg';
import Author from 'assets/img/placeholder/author.png';
import { FacebookIcon, TwitterIcon } from 'components/utils/Icons';

const Articles = () => (
  <>
    <Header />
    <header className="container-fluid">
      <div className="row">
        <div className="col-sm-8 mx-auto">
          <h2 className="text-center mt-5">
            Here are some things you should know regarding nigeria real estate
            and how it works
          </h2>
        </div>
      </div>
    </header>

    <img src={ArticleImage} alt="Article" className="img-fluid" />

    <article className="container-fluid articles-page">
      <div className="row">
        <div className="col-sm-6 mx-auto">
          <section className="author-block">
            <div className="row">
              <div className="col-sm-6">
                <div className="d-flex mb-5">
                  <img
                    className="rounded-circle mr-3 border my-auto"
                    alt="Author"
                    src={Author}
                    height={50}
                  />
                  <div className="my-auto">
                    <span className="text-primary">Eronss Okojie</span>
                    <div className="text-muted small">
                      April 22, 2019 . 4 min read
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-sm-6 text-right">
                <div
                  className="btn-group"
                  role="group"
                  aria-label="Basic example"
                >
                  <button type="button" className="btn btn-sm btn-light">
                    <FacebookIcon />
                  </button>
                  <button type="button" className="btn btn-sm btn-light">
                    <TwitterIcon />{' '}
                  </button>
                </div>
              </div>
            </div>
          </section>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis eu
            velit tempus erat egestas efficitur. In hac habitasse platea
            dictumst. Fusce a nunc eget ligula suscipit finibus. Aenean pharetra
            quis lacus at viverra.
          </p>
          <p>
            Class aptent taciti sociosqu ad litora torquent per conubia nostra,
            per inceptos himenaeos. Aliquam quis posuere ligula. In eu dui
            molestie, molestie lectus eu, semper lectus.
          </p>

          <h4>Next on the Project</h4>
          <p>
            Duis eu velit tempus erat egestas efficitur. In hac habitasse platea
            dictumst. Fusce a nunc eget ligula suscipit finibus. Aenean pharetra
            quis lacus at viverra. Class aptent taciti sociosqu ad litora
            torquent per conubia nostra, per inceptos himenaeos.
          </p>
          <p>
            Morbi efficitur auctor metus, id mollis lorem pellentesque id.
            Nullam posuere maximus dui et fringilla.
          </p>

          <p>
            Aenean pharetra quis lacus at viverra. Class aptent taciti sociosqu
            ad litora torquent per conubia nostra, per inceptos himenaeos.
            Aliquam quis posuere ligula.
          </p>
          <p>
            In eu dui molestie, molestie lectus eu, semper lectus. Proin at
            justo lacinia, auctor nisl et, consequat ante. Donec sit amet nisi
            arcu. Morbi efficitur auctor metus, id mollis lorem pellentesque id.
            Nullam posuere maximus dui et fringilla. Nulla non volutpat leo.
          </p>
          <p></p>

          <div className="btn-group" role="group" aria-label="Basic example">
            <button type="button" className="btn btn-light">
              <FacebookIcon />
              Share on Facebook
            </button>
            <button type="button" className="btn btn-light">
              <TwitterIcon />
              Share on Twitter
            </button>
          </div>

          <div className="tags mt-3 font-weight-bold">
            Tags: <u className="tag">product design</u>,{' '}
            <u className="tag">culture</u>{' '}
          </div>

          <div className="dotted-border my-5"></div>

          <div className="d-flex mb-5">
            <img
              className="rounded-circle mr-3 border my-auto"
              alt="Author"
              src={Author}
              height={50}
            />
            <div className="my-auto">
              <strong className="text-primary">Eronss Okojie</strong> is a
              Design Founder &amp; Advisor, Lasgidi School of Creative
              Leadership Executive MBA participant, Zuppie advisor, myprodgy
              co-founder, and Nordic Rose stakeholder.
            </div>
          </div>
        </div>
      </div>
    </article>
    <Footer />
  </>
);

export default Articles;
