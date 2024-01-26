import {Helmet} from 'react-helmet-async';

const Seo = ({ title, description }) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name='description' content={description} />
    </Helmet>
  );
};

export default Seo;