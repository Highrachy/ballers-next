import React from 'react';
import {
  PDFDownloadLink,
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFViewer,
  Image,
  Line,
  Font,
} from '@react-pdf/renderer';
import { getTinyDate } from '@/utils/date-helpers';
import { moneyFormat } from '@/utils/helpers';

const InvoicePDFDocument = ({ transaction, paymentInfo, showPreview }) => {
  const Doc = (
    <InvoicePDFContent transaction={transaction} paymentInfo={paymentInfo} />
  );

  return (
    <>
      {showPreview && (
        <PDFViewer width="500" height="800">
          {Doc}
        </PDFViewer>
      )}
      <PDFDownloadLink document={Doc} fileName={`information.pdf`}>
        {({ blob, url, loading, error }) => (
          <div className="mt-5">
            {loading ? 'Loading document...' : 'Download as PDF'}
          </div>
        )}
      </PDFDownloadLink>
    </>
  );
};

const InvoicePDFContent = ({ transaction, paymentInfo }) => {
  const { userInfo } = transaction || {};
  const userName = `${userInfo.firstName} ${userInfo.lastName}`;

  return (
    <Document>
      <Page>
        <View style={styles.page}>
          <View style={[styles.body, { backgroundColor: '#ffffff' }]}>
            <OneColumnRow>
              <Image
                alt="Ball Logo"
                style={styles.logo}
                src="/img/ballers-logo.png"
                fixed
              />
            </OneColumnRow>
            <Spacer />
            <OneColumnRow className={[styles.userName, styles.bold]}>
              {userName}
            </OneColumnRow>
            <MultiColumnRow
              leftContent={
                <Text>
                  Date Issued: &nbsp;
                  <Text style={styles.bold}>
                    {getTinyDate(transaction.paidOn)}
                  </Text>
                </Text>
              }
              rightContent="+234 708 7821 561"
            />
            <MultiColumnRow
              leftContent={
                <Text>
                  Receipt No: &nbsp;
                  <Text style={styles.bold}>{transaction.receiptNo}</Text>
                </Text>
              }
              rightContent="info@ballers.ng"
            />
            <Spacer type="lg" />
            <TwoColumnRow
              className={styles.bold}
              leftContent={`DESCRIPTION`}
              rightContent="TOTAL"
            />
            <LineSeparator />
            <Spacer type="xs" />
            <TwoColumnRow
              leftContent={paymentInfo.title}
              rightContent={`N ${moneyFormat(transaction.amount)}`}
              rightClassName={styles.amount}
            />
            <Spacer type="lg" />
          </View>
          <View style={[styles.body, { backgroundColor: '#f5f5f5' }]}>
            <Spacer />
            <Spacer />
            <MultiColumnRow
              className={styles.bold}
              leftContent="PAYMENT INFO"
              centerContent="PAID ON"
              rightContent="TOTAL"
            />
            <LineSeparator />
            <MultiColumnRow
              leftContent={
                <View style={styles.column}>
                  <View>
                    <Text style={styles.smallText}>
                      Via {transaction.paymentSource}
                    </Text>
                    <Text style={styles.smallText}>{paymentInfo.title}</Text>
                  </View>
                  <View>
                    <Text style={styles.smallText}>
                      {paymentInfo.description}
                    </Text>
                  </View>
                </View>
              }
              centerContent={getTinyDate(transaction.paidOn)}
              rightContent={`N ${moneyFormat(transaction.amount)}`}
              rightClassName={[styles.amount, styles.bold, styles.bigText]}
              centerClassName={[styles.bigText, styles.bold]}
            />
            <LineSeparator />
            <OneColumnRow className={[styles.smallText, styles.gray]}>
              Ref: {transaction.additionalInfo} / {transaction._id}
            </OneColumnRow>
            <Spacer type="lg" />

            <TwoColumnRow
              leftContent={`Thank You`}
              rightContent="BECOME A LANDLORD"
              rightClassName={styles.lightGray}
              leftClassName={[styles.bold, styles.blue, styles.bigText]}
            />

            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                textAlign: 'center',
                margin: 'auto',
              }}
              fixed
            >
              <Text style={[styles.footerText, styles.gray]}>
                This receipt is automatically generated at Ballers.ng
              </Text>
            </View>
            <Spacer />
          </View>
        </View>
      </Page>
    </Document>
  );
};

const OneColumnRow = ({ content = '', children, className = '' }) => (
  <View style={[styles.row]}>
    <Text style={className}>{children || content}</Text>
  </View>
);

const TwoColumnRow = ({
  leftContent,
  rightContent,
  className = '',
  leftClassName = '',
  rightClassName = '',
}) => (
  <View style={[styles.row, className, { justifyContent: 'space-between' }]}>
    <View style={[styles.leftElement]}>
      <Text style={leftClassName}>{leftContent}</Text>
    </View>
    <View style={[styles.rightElement]}>
      <Text style={rightClassName}>{rightContent}</Text>
    </View>
  </View>
);

const MultiColumnRow = ({
  leftContent,
  centerContent,
  rightContent,
  className = '',
  leftClassName = '',
  centerClassName = '',
  rightClassName = '',
}) => (
  <View style={[styles.row, className, { justifyContent: 'space-between' }]}>
    <View style={styles.leftElement}>
      {typeof leftContent === 'string' ? (
        <Text style={leftClassName}>{leftContent}</Text>
      ) : (
        leftContent
      )}
    </View>
    {centerContent && (
      <View style={styles.centerElement}>
        {typeof centerContent === 'string' ? (
          <Text style={centerClassName}>{centerContent}</Text>
        ) : (
          centerContent
        )}
      </View>
    )}
    {rightContent && (
      <View style={styles.rightElement}>
        {typeof rightContent === 'string' ? (
          <Text style={rightClassName}>{rightContent}</Text>
        ) : (
          rightContent
        )}
      </View>
    )}
  </View>
);

const Spacer = ({ type = 'md' }) => <View style={styles.spacer[type]} />;
const LineSeparator = () => <View style={styles.separator} />;

const styles = StyleSheet.create({
  page: {
    flex: 1,
    flexDirection: 'column',
  },

  body: {
    paddingTop: 20,
    paddingBottom: 10,
    paddingHorizontal: 35,
    backgroundColor: '#f5f5f5',
    color: '#161d3f',
    flex: 1,
  },

  logo: {
    marginVertical: 5,
    width: 75,
    height: 47,
    marginBottom: 10,
  },

  spacer: {
    xs: { marginBottom: 5 },
    sm: { marginBottom: 15 },
    md: { marginBottom: 30 },
    lg: { marginBottom: 60 },
  },

  separator: {
    borderBottom: 1,
    borderColor: '#dee2e6',
    marginBottom: 10,
  },

  row: {
    display: 'flex',
    flexDirection: 'row',
    paddingBottom: 10,
    fontFamily: 'Barlow',
    fontSize: 12,
  },

  column: {
    display: 'flex',
    flexDirection: 'column',
  },

  smallText: {
    fontSize: 8,
    paddingBottom: 5,
  },

  bigText: {
    fontSize: 18,
    paddingBottom: 5,
  },

  leftElement: {
    // Styles for the left-aligned element
    flex: 1, // This will take up half of the row's width
  },

  centerElement: {
    flex: 1,
    textAlign: 'center',
  },

  rightElement: {
    flex: 1, // This will take up half of the row's width
    textAlign: 'right', // This right-aligns the text within the element
  },

  bold: {
    fontWeight: 600,
  },

  amount: {
    color: '#8b1f25',
  },

  userName: {
    fontSize: 12,
    color: '#062acb',
  },

  footer: {
    backgroundColor: '#f5f5f5',
  },

  lightGray: {
    color: '#aaaaaa',
  },

  gray: {
    color: '#5a6679 ',
  },

  blue: {
    color: '#022b69',
  },

  footerText: {
    textAlign: 'center',
    fontSize: 7,
  },
});

export default InvoicePDFDocument;

// Font.register({
//   family: 'Barlow',
//   src: 'http://fonts.gstatic.com/s/barlow/v12/7cHqv4kjgoGqM7E3_-gc4FAtlT47dw.ttf',
// });

Font.register({
  family: 'Barlow',
  fonts: [
    {
      src: 'http://fonts.gstatic.com/s/barlow/v12/7cHpv4kjgoGqM7EPC8E46HsxnA.ttf',
    },
    {
      src: 'http://fonts.gstatic.com/s/barlow/v12/7cHqv4kjgoGqM7E30-8c4FAtlT47dw.ttf',
      fontWeight: 'bold',
    },
  ],
});

// https://developers.google.com/fonts/docs/developer_api?apix_params=%7B%22family%22%3A%5B%22Barlow%22%5D%2C%22sort%22%3A%22ALPHA%22%7D
// https://stackoverflow.com/questions/70126411/how-to-add-custom-font-in-react-pdf-pdf
const Barlow = {
  kind: 'webfonts#webfontList',
  items: [
    {
      family: 'Barlow',
      variants: [
        '100',
        '100italic',
        '200',
        '200italic',
        '300',
        '300italic',
        'regular',
        'italic',
        '500',
        '500italic',
        '600',
        '600italic',
        '700',
        '700italic',
        '800',
        '800italic',
        '900',
        '900italic',
      ],
      subsets: ['latin', 'latin-ext', 'vietnamese'],
      version: 'v12',
      lastModified: '2022-09-22',
      files: {
        100: 'http://fonts.gstatic.com/s/barlow/v12/7cHrv4kjgoGqM7E3b8s8yn4hnCci.ttf',
        '100italic':
          'http://fonts.gstatic.com/s/barlow/v12/7cHtv4kjgoGqM7E_CfNYwHoDmTcibrA.ttf',
        200: 'http://fonts.gstatic.com/s/barlow/v12/7cHqv4kjgoGqM7E3w-oc4FAtlT47dw.ttf',
        '200italic':
          'http://fonts.gstatic.com/s/barlow/v12/7cHsv4kjgoGqM7E_CfP04Voptzsrd6m9.ttf',
        300: 'http://fonts.gstatic.com/s/barlow/v12/7cHqv4kjgoGqM7E3p-kc4FAtlT47dw.ttf',
        '300italic':
          'http://fonts.gstatic.com/s/barlow/v12/7cHsv4kjgoGqM7E_CfOQ4loptzsrd6m9.ttf',
        regular:
          'http://fonts.gstatic.com/s/barlow/v12/7cHpv4kjgoGqM7EPC8E46HsxnA.ttf',
        italic:
          'http://fonts.gstatic.com/s/barlow/v12/7cHrv4kjgoGqM7E_Ccs8yn4hnCci.ttf',
        500: 'http://fonts.gstatic.com/s/barlow/v12/7cHqv4kjgoGqM7E3_-gc4FAtlT47dw.ttf',
        '500italic':
          'http://fonts.gstatic.com/s/barlow/v12/7cHsv4kjgoGqM7E_CfPI41optzsrd6m9.ttf',
        600: 'http://fonts.gstatic.com/s/barlow/v12/7cHqv4kjgoGqM7E30-8c4FAtlT47dw.ttf',
        '600italic':
          'http://fonts.gstatic.com/s/barlow/v12/7cHsv4kjgoGqM7E_CfPk5Foptzsrd6m9.ttf',
        700: 'http://fonts.gstatic.com/s/barlow/v12/7cHqv4kjgoGqM7E3t-4c4FAtlT47dw.ttf',
        '700italic':
          'http://fonts.gstatic.com/s/barlow/v12/7cHsv4kjgoGqM7E_CfOA5Voptzsrd6m9.ttf',
        800: 'http://fonts.gstatic.com/s/barlow/v12/7cHqv4kjgoGqM7E3q-0c4FAtlT47dw.ttf',
        '800italic':
          'http://fonts.gstatic.com/s/barlow/v12/7cHsv4kjgoGqM7E_CfOc5loptzsrd6m9.ttf',
        900: 'http://fonts.gstatic.com/s/barlow/v12/7cHqv4kjgoGqM7E3j-wc4FAtlT47dw.ttf',
        '900italic':
          'http://fonts.gstatic.com/s/barlow/v12/7cHsv4kjgoGqM7E_CfO451optzsrd6m9.ttf',
      },
      category: 'sans-serif',
      kind: 'webfonts#webfont',
      menu: 'http://fonts.gstatic.com/s/barlow/v12/7cHpv4kjgoGqM7E_Css8.ttf',
    },
  ],
};
