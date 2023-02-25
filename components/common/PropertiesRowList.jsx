import { RecommendedPropertyLists } from './PropertyCard';

export const PropertiesRowList = ({ results, title }) => {
  return results && results.length > 0 ? (
    <div className="container-fluid">
      {title && <h4 className="mb-5">{title}</h4>}
      <div className="row">
        <RecommendedPropertyLists
          propertyClassName="col-sm-6"
          properties={results}
        />
      </div>
    </div>
  ) : null;
};
