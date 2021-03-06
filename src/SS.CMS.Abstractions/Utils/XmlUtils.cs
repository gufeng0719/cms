using System.Xml;


namespace SS.CMS.Abstractions
{
	public class XmlUtils
	{

		public static XmlDocument GetXmlDocument(string xmlContent)
		{
			var xmlDocument = new XmlDocument();
			try
			{
				xmlDocument.LoadXml(xmlContent);
			}
		    catch
		    {
		        // ignored
		    }

		    return xmlDocument;
		}

		public static XmlNode GetXmlNode(XmlDocument xmlDocument, string xpath)
		{
			XmlNode node = null;
			try
			{
				node = xmlDocument.SelectSingleNode(xpath);
			}
		    catch
		    {
		        // ignored
		    }
		    return node;
		}
	}
}
