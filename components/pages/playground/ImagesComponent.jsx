import React from 'react';
import Header from 'components/layout/Header';
import CommunityGallery from 'components/common/CommunityGallery';
import Footer from 'components/layout/Footer';
import TitleSection from 'components/common/TitleSection';
import Image, { LocalImage } from 'components/utils/Image';

const testImageURL =
  'https://ballers-staging.s3.amazonaws.com/test/property3.jpeg';

const ImagesComponent = () => (
  <>
    <Header />

    <TitleSection name="Form Components" content="Playground for forms" />
    <Content />
    <CommunityGallery />
    <Footer />
  </>
);

const Content = () => (
  <div className="container-fluid">
    <div className="row">
      <div className="offset-lg-2 col-lg-8 mt-7">
        <h4>Images Option</h4>
        <Images />
      </div>
    </div>
  </div>
);

const Images = () => (
  <section className="mt-5">
    <div className="thumbnail">
      <LocalImage src={testImageURL} alt="test" className="img-fluid" />
      <div className="caption">
        <strong>Original Image from Amazon S3</strong>
      </div>
    </div>

    <aside className="row mt-5 pt-5 border-top">
      <div className="col-6">
        <div className="thumbnail">
          <Image src={testImageURL} alt="test" name="test" />
          <div className="caption">
            <strong>Image from ImageServ (No option)</strong>
          </div>
        </div>
      </div>
      <div className="col-6">
        <div className="thumbnail">
          <Image
            src={testImageURL}
            alt="test"
            name="test"
            options={{ blur: 25 }}
          />
          <div className="caption">
            <strong>Image from ImageServ (Blur 25)</strong>
          </div>
        </div>
      </div>
    </aside>

    <aside className="row mt-5 pt-5 border-top">
      <div className="col-6">
        <div className="thumbnail">
          <Image
            src={testImageURL}
            alt="test"
            name="test"
            options={{ w: 200 }}
            responsiveImage={false}
          />
          <div className="caption">
            <strong>Image from ImageServ (width=200)</strong>
          </div>
        </div>
      </div>
      <div className="col-6">
        <div className="thumbnail">
          <Image
            src={testImageURL}
            alt="test"
            name="test"
            options={{ h: 200 }}
            responsiveImage={false}
          />
          <div className="caption">
            <strong>Image from ImageServ (Height 200)</strong>
          </div>
        </div>
      </div>
    </aside>

    <aside className="row mt-5 pt-5 border-top">
      <div className="col-6">
        <div className="thumbnail">
          <Image
            src={testImageURL}
            alt="test"
            name="test"
            options={{ h: 200, w: 200, fit: 'outside' }}
            responsiveImage={false}
          />
          <div className="caption">
            <strong>Image from ImageServ (fit=outside)</strong>
            Preserving aspect ratio, resize the image to be as small as possible
            while ensuring its dimensions are greater than or equal to both
            those specified.
          </div>
        </div>
      </div>

      <div className="col-6 mt-5">
        <div className="thumbnail">
          <Image
            src={testImageURL}
            alt="test"
            name="test"
            options={{ h: 200, w: 200, fit: 'cover' }}
            responsiveImage={false}
          />
          <div className="caption">
            <strong>Image from ImageServ (fit=cover)</strong>
            Crop the image to cover both provided dimensions.
          </div>
        </div>
      </div>

      <div className="col-6 mt-5">
        <div className="thumbnail">
          <Image
            src={testImageURL}
            alt="test"
            name="test"
            options={{ h: 200, w: 200, fit: 'fill', cbg: 'red' }}
            responsiveImage={false}
          />
          <div className="caption">
            <strong>Image from ImageServ (fit=fill)</strong>
            Ignore the aspect ratio of the input and stretch to both provided
            dimensions.
          </div>
        </div>
      </div>

      <div className="col-6">
        <div className="thumbnail">
          <Image
            src={testImageURL}
            alt="test"
            name="test"
            options={{ h: 200, w: 200, fit: 'contain' }}
            responsiveImage={false}
          />
          <div className="caption">
            <strong>Image from ImageServ (fit=contain)</strong>
            Embed within both provided dimensions. The remaining space can be
            filled with a background color by using &cbg=. See here for the
            supported color formats.
          </div>
        </div>
      </div>
    </aside>

    <aside className="row mt-5 pt-5 border-top">
      <div className="col-6">
        <div className="thumbnail">
          <Image
            src={testImageURL}
            alt="test"
            name="test"
            options={{ h: 200, w: 200, fit: 'cover', a: 'attention' }}
            responsiveImage={false}
          />
          <div className="caption">
            <strong>Image from ImageServ (Smart Crop)</strong>
            An experimental strategy-based approach to crop the image by
            removing boring parts. This only works with &fit=cover.
          </div>
        </div>
      </div>
      <div className="col-6">
        <div className="thumbnail">
          <Image
            src={testImageURL}
            alt="test"
            name="test"
            options={{ h: 200, w: 200, trim: 10 }}
            responsiveImage={false}
          />
          <div className="caption">
            <strong>Image from ImageServ (trim=x)</strong>
            Use values between 1 and 254 to define a tolerance level to trim
            away similar color values.
          </div>
        </div>
      </div>
    </aside>

    <aside className="thumbnail mt-5 pt-5 border-top">
      <Image
        src={testImageURL}
        alt="test"
        name="test"
        className="img-fluid"
        watermark
      />
      <div className="caption">
        <strong>Image with Watermark</strong>
      </div>
    </aside>
  </section>
);

export default ImagesComponent;
