using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using CharacterRecordsGenerator;

namespace CharacterRecordsGeneratorTests
{
    [TestClass]
    public class CharacterRecordsUtilitiesTests
    {
        [TestMethod]
        public void Utility_CmToFeet_WithValidNumber()
        {
            double cm = 150.0;
            string expected = "4'11\"";
            Assert.AreEqual(expected, Utility.CmToFeet(cm));
        }
    }
}
