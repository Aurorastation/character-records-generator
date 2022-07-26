using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using Humanizer;

namespace CharacterRecordsGenerator
{
    public static class Utility
    {
        public static IList<string> LineSplit(this string source) =>
            source.Split('\n').Where(item => item.Trim().Length != 0).ToList();

        public static string CmToFeet(double cm)
        {
            var feet = Math.Floor(cm * 0.0328084);
            var inches = Math.Floor(cm * 0.39370079); // Isn't imperial a lovely system?
            inches -= feet * 12;
            return $"{feet}'{inches}\"";
        }

        /// <summary>
        ///	Converts a weight in Kilograms to Pounds.
        /// </summary>
        /// <param name="kg">The weight in kilograms.</param>
        /// <returns>The weight converted to pounds.</returns>
        public static double KgToLb(double kg) => Math.Round(kg * 2.2046, 2);

        /// <summary>
        /// Returns <paramref name="val"/> and a trailing space if val is not whitespace, <see cref="string.Empty"/> otherwise.
        /// </summary>
        /// <param name="val"></param>
        /// <returns></returns>
        public static string SpaceIfValue(this string val) => string.IsNullOrWhiteSpace(val) ? string.Empty : $"{val} ";

        public static string HumanisedDate(DateTime date) => $"{date.ToString("MMMM")} {date.Day.Ordinalize()}, {date.Year}";

        public static string IfEmpty(this string target, string fallback) =>
            target.IsEmpty() ? fallback : target;

        public static bool IsEmpty(this string val) => string.IsNullOrWhiteSpace(val);

        public static string FormatAsList(this IEnumerable<string> target) =>
            target.Aggregate(new StringBuilder(), (b, s) => b.AppendLine($" - {s.Trim()}")).ToString();

        public static string Repeat(this string target, int repeatNum)
        {
            var builder = new StringBuilder(target.Length * repeatNum);
            for (var i = 0; i < repeatNum; i++)
                builder.Append(target);

            return builder.ToString();
        }

        public static string SubspeciesNiceName(SpeciesSubType species)
        {
            var attr = species.GetAttributeOfType<SubspeciesMetaAttribute>();
            return attr?.NiceName ?? Enum.GetName(typeof(SpeciesSubType), species);
        }

        public static SpeciesSubType SubspeciesNiceNameToEnum(string nicename)
        {
            return (from item in Enum.GetValues(typeof(SpeciesSubType)).Cast<SpeciesSubType>()
                    let attr = item.GetAttributeOfType<SubspeciesMetaAttribute>()
                    where attr != null && attr.NiceName == nicename
                    select item).FirstOrDefault();
        }

        public static Version GetVersion() => Assembly.GetExecutingAssembly().GetName().Version;
    }

    // From https://stackoverflow.com/questions/1799370/getting-attributes-of-enums-value
    public static class EnumHelper
    {
        /// <summary>
        /// Gets an attribute on an enum field value
        /// </summary>
        /// <typeparam name="T">The type of the attribute you want to retrieve</typeparam>
        /// <param name="enumVal">The enum value</param>
        /// <returns>The attribute of type T that exists on the enum value</returns>
        /// <example>string desc = myEnumVariable.GetAttributeOfType<DescriptionAttribute>().Description;</example>
        public static T GetAttributeOfType<T>(this Enum enumVal) where T : Attribute
        {
            var type = enumVal.GetType();
            var memInfo = type.GetMember(enumVal.ToString());
            var attributes = memInfo[0].GetCustomAttributes(typeof(T), false);
            return attributes.Length > 0 ? (T)attributes[0] : null;
        }
    }
}