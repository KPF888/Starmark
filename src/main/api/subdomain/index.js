import { SubDomainBrute } from '../../class/SubDomainBrute';

export const bruteSubDomain = (event, options) => {
  const { domainList, concurrent, timeout } = options;
  console.log('bruteSubDomain: ', concurrent);
  const brute = new SubDomainBrute(domainList, concurrent);
  return brute.bruteForceSubdomains(event, timeout);
};
